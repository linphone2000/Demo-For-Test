import { create } from "zustand";
import { Portfolio } from "@/types/models";
import { databaseService } from "@/services/mock/databaseService";
import { useAuthStore } from "./useAuthStore";

interface PortfolioState {
  portfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
  isGuestMode: boolean;

  // Actions
  loadPortfolio: (userId?: string) => Promise<void>;
  loadGuestPortfolio: () => Promise<void>;
  refreshPortfolio: (userId: string) => Promise<void>;
  buyProperty: (propertyId: string, amountMMK: number) => Promise<boolean>;
  sellProperty: (propertyId: string, amountMMK: number) => Promise<boolean>;
  simulateMarket: (deltaPct: number) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolio: null,
  loading: false,
  error: null,
  isGuestMode: false,

  loadPortfolio: async (userId?: string) => {
    try {
      set({ loading: true, error: null });
      
      const currentUser = useAuthStore.getState().user;
      
      // If no userId provided and no authenticated user, load guest portfolio
      if (!userId && !currentUser) {
        await get().loadGuestPortfolio();
        return;
      }
      
      // Use provided userId or current user's id
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) {
        await get().loadGuestPortfolio();
        return;
      }
      
      // Initialize database from storage
      await databaseService.initializeFromStorage();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const portfolio = await databaseService.getPortfolio(targetUserId);
      if (portfolio) {
        set({ portfolio, loading: false, isGuestMode: false });
      } else {
        set({ 
          error: "Failed to load portfolio data", 
          loading: false,
          isGuestMode: false
        });
      }
    } catch (error) {
      console.error("Load portfolio error:", error);
      set({ 
        error: "Failed to load portfolio data", 
        loading: false,
        isGuestMode: false
      });
    }
  },

  loadGuestPortfolio: async () => {
    try {
      set({ loading: true, error: null });
      
      // Initialize database to get properties
      await databaseService.initializeFromStorage();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const properties = await databaseService.getAllProperties();
      
      // Calculate total market value from all properties
      const totalMarketValue = properties.reduce((sum, prop) => sum + prop.currentValueMMK, 0);
      
      // Create a guest portfolio with public market overview (no personal data)
      const guestPortfolio: Portfolio = {
        userId: "guest",
        cashMMK: 0, // No personal cash for guests
        totalValueMMK: totalMarketValue, // Show total market value
        netPnlAbs: 0, // No personal P&L for guests
        netPnlPct: 0, // No personal P&L for guests
        holdings: [], // No personal holdings for guests
        activities: [], // No personal activities for guests
        snapshot: {
          companyValueMMK: totalMarketValue,
          companyShares: 1000000, // Total company shares
          weightedSharePct: 0, // Not relevant for guests - will be hidden
          propertiesCount: properties.length,
        },
        lastUpdated: new Date().toISOString(),
      };
      
      set({ portfolio: guestPortfolio, loading: false, isGuestMode: true });
    } catch (error) {
      console.error("Load guest portfolio error:", error);
      set({ 
        error: "Failed to load demo data", 
        loading: false,
        isGuestMode: true
      });
    }
  },

  refreshPortfolio: async (userId: string) => {
    try {
      // Refresh without loading state to avoid UI disruption
      const portfolio = await databaseService.getPortfolio(userId);
      if (portfolio) {
        set({ portfolio, error: null });
      }
    } catch (error) {
      console.error("Refresh portfolio error:", error);
      // Don't show error on refresh, just log it
    }
  },

  buyProperty: async (propertyId: string, amountMMK: number) => {
    try {
      const { portfolio, isGuestMode } = get();
      if (!portfolio) return false;

      // Prevent actions in guest mode
      if (isGuestMode) {
        console.log("Buy action blocked in guest mode");
        return false;
      }

      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return false;

      const success = await databaseService.executeBuy(
        currentUser.id,
        propertyId,
        amountMMK
      );

      if (success) {
        // Refresh portfolio data without loading state
        await get().refreshPortfolio(currentUser.id);
      }

      return success;
    } catch (error) {
      console.error("Buy property error:", error);
      return false;
    }
  },

  sellProperty: async (propertyId: string, amountMMK: number) => {
    try {
      const { portfolio, isGuestMode } = get();
      if (!portfolio) return false;

      // Prevent actions in guest mode
      if (isGuestMode) {
        console.log("Sell action blocked in guest mode");
        return false;
      }

      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return false;

      const success = await databaseService.executeSell(
        currentUser.id,
        propertyId,
        amountMMK
      );

      if (success) {
        // Refresh portfolio data without loading state
        await get().refreshPortfolio(currentUser.id);
      }

      return success;
    } catch (error) {
      console.error("Sell property error:", error);
      return false;
    }
  },

  simulateMarket: async (deltaPct: number) => {
    try {
      const { isGuestMode } = get();
      
      // Prevent actions in guest mode
      if (isGuestMode) {
        console.log("Simulate action blocked in guest mode");
        return;
      }

      const success = await databaseService.simulateMarketChange(deltaPct);
      
      if (success) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          // Refresh portfolio data without loading state
          await get().refreshPortfolio(currentUser.id);
        }
      }
    } catch (error) {
      console.error("Simulate market error:", error);
    }
  },
}));
