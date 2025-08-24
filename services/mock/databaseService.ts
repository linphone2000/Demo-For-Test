import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, Portfolio, Property, Holding, Activity } from "@/types/models";

// Import mock data
import usersData from "@/mock/users.json";
import portfoliosData from "@/mock/portfolios.json";
import propertiesData from "@/mock/properties.json";

// Storage keys
const AUTH_STORAGE_KEY = "app_auth_user";
const PORTFOLIO_STORAGE_KEY = "app_portfolio_data";
const USERS_STORAGE_KEY = "app_users_data";
const PROPERTIES_STORAGE_KEY = "app_properties_data";
const DYNAMIC_PROPERTIES_STORAGE_KEY = "app_dynamic_properties_data";

// Database interface
interface Database {
  users: User[];
  portfolios: { [userId: string]: Portfolio };
  properties: Property[]; // Static + dynamic properties combined
  dynamicProperties: Property[]; // Properties added through admin CRUD
}

class DatabaseService {
  private db: Database;

  constructor() {
    this.db = {
      users: usersData.users,
      portfolios: portfoliosData.portfolios as unknown as { [userId: string]: Portfolio },
      properties: propertiesData.properties as unknown as Property[], // Will be combined with dynamic
      dynamicProperties: [], // Will be loaded from AsyncStorage
    };
  }

  // User Authentication Methods
  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = this.db.users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Update last login
        user.lastLogin = new Date().toISOString();
        
        // Save to AsyncStorage
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        
        return user;
      }
      return null;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  // User Management Methods
  async createUser(email: string, password: string, name: string): Promise<User | null> {
    try {
      // Check if user already exists
      const existingUser = this.db.users.find(u => u.email === email);
      if (existingUser) {
        console.log("User already exists");
        return null;
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        password,
        name,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Add to database
      this.db.users.push(newUser);

      // Save users to AsyncStorage
      await this.saveUsersToStorage();

      // Create initial portfolio for the new user
      await this.createInitialPortfolio(newUser.id);

      return newUser;
    } catch (error) {
      console.error("Create user error:", error);
      return null;
    }
  }

  private async createInitialPortfolio(userId: string): Promise<void> {
    try {
      const initialPortfolio: Portfolio = {
        userId,
        cashMMK: 100000000, // 100M MMK starting cash
        totalValueMMK: 100000000,
        netPnlAbs: 0,
        netPnlPct: 0,
        holdings: [],
        snapshot: {
          companyValueMMK: 9000000000,
          companyShares: 1000000,
          weightedSharePct: 0,
          propertiesCount: this.db.properties.length,
        },
        activities: [
          {
            id: `activity-${Date.now()}`,
            type: "injection",
            propertyId: "", // No property for cash injection
            amountMMK: 100000000,
            ts: Date.now(),
            description: "Initial cash injection for new user",
          }
        ],
        lastUpdated: new Date().toISOString(),
      };

      this.db.portfolios[userId] = initialPortfolio;
      
      // Save portfolios to AsyncStorage
      await AsyncStorage.setItem(
        PORTFOLIO_STORAGE_KEY,
        JSON.stringify(this.db.portfolios)
      );
    } catch (error) {
      console.error("Create initial portfolio error:", error);
    }
  }

  private async saveUsersToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify({ users: this.db.users })
      );
    } catch (error) {
      console.error("Save users to storage error:", error);
    }
  }

  private async savePropertiesToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        PROPERTIES_STORAGE_KEY,
        JSON.stringify({ properties: this.db.properties })
      );
    } catch (error) {
      console.error("Save properties to storage error:", error);
    }
  }

  // Portfolio Methods
  async getPortfolio(userId: string): Promise<Portfolio | null> {
    try {
      const portfolio = this.db.portfolios[userId];
      if (!portfolio) {
        // Create new portfolio for user if it doesn't exist
        const newPortfolio: Portfolio = {
          userId,
          cashMMK: 100000000, // 100M MMK starting cash
          totalValueMMK: 0,
          netPnlAbs: 0,
          netPnlPct: 0,
          holdings: [],
          snapshot: {
            companyValueMMK: 9000000000,
            companyShares: 1000000,
            weightedSharePct: 0,
            propertiesCount: this.db.properties.length,
          },
          activities: [],
          lastUpdated: new Date().toISOString(),
        };
        
        this.db.portfolios[userId] = newPortfolio;
        return newPortfolio;
      }
      return portfolio;
    } catch (error) {
      console.error("Get portfolio error:", error);
      return null;
    }
  }

  async updatePortfolio(userId: string, portfolio: Portfolio): Promise<boolean> {
    try {
      portfolio.lastUpdated = new Date().toISOString();
      this.db.portfolios[userId] = portfolio;
      
      // Save to AsyncStorage for persistence
      await AsyncStorage.setItem(
        PORTFOLIO_STORAGE_KEY,
        JSON.stringify(this.db.portfolios)
      );
      
      return true;
    } catch (error) {
      console.error("Update portfolio error:", error);
      return false;
    }
  }

  // Property Methods
  async getAllProperties(): Promise<Property[]> {
    return this.db.properties;
  }

  async getPropertyById(id: string): Promise<Property | null> {
    return this.db.properties.find(prop => prop.id === id) || null;
  }

  async updatePropertyValue(propertyId: string, newValue: number): Promise<boolean> {
    try {
      const property = this.db.properties.find(p => p.id === propertyId);
      if (property) {
        property.currentValueMMK = newValue;
        
        // Save properties to AsyncStorage
        await this.savePropertiesToStorage();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update property value error:", error);
      return false;
    }
  }

  // Trading Methods
  async executeBuy(
    userId: string,
    propertyId: string,
    amountMMK: number
  ): Promise<boolean> {
    try {
      const portfolio = await this.getPortfolio(userId);
      if (!portfolio) return false;

      const property = await this.getPropertyById(propertyId);
      if (!property) return false;

      // Check if user has enough cash
      if (portfolio.cashMMK < amountMMK) return false;

      // Calculate new share percentage
      const newSharePct = (amountMMK / property.currentValueMMK) * 100;

      // Find existing holding or create new one
      const existingHoldingIndex = portfolio.holdings.findIndex(
        h => h.propertyId === propertyId
      );

      if (existingHoldingIndex >= 0) {
        // Update existing holding
        const existing = portfolio.holdings[existingHoldingIndex];
        const newTotalValue = existing.userValueMMK + amountMMK;
        const newTotalSharePct = existing.userSharePct + newSharePct;
        
        portfolio.holdings[existingHoldingIndex] = {
          ...existing,
          userSharePct: newTotalSharePct,
          userValueMMK: newTotalValue,
          purchaseValueMMK: existing.purchaseValueMMK + amountMMK,
          pnlAbs: newTotalValue - (existing.purchaseValueMMK + amountMMK),
          pnlPct: ((newTotalValue - (existing.purchaseValueMMK + amountMMK)) / (existing.purchaseValueMMK + amountMMK)) * 100,
        };
      } else {
        // Create new holding
        const sharesToBuy = Math.floor(amountMMK / property.sharePriceMMK);
        const actualAmount = sharesToBuy * property.sharePriceMMK;

        portfolio.holdings.push({
          propertyId,
          userSharePct: newSharePct,
          userValueMMK: actualAmount,
          purchaseValueMMK: actualAmount,
          pnlAbs: 0,
          pnlPct: 0,
          purchaseDate: new Date().toISOString(),
          sharesOwned: sharesToBuy,
          currentSharePriceMMK: property.sharePriceMMK,
          averagePurchasePriceMMK: property.sharePriceMMK,
        });
      }

      // Create activity
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        type: "buy",
        propertyId,
        amountMMK,
        ts: Date.now(),
        description: `Bought ${newSharePct.toFixed(2)}% of ${property.name}`,
      };

      // Update portfolio
      portfolio.cashMMK -= amountMMK;
      portfolio.activities.unshift(newActivity);
      portfolio.activities = portfolio.activities.slice(0, 10); // Keep only 10 latest activities

      // Recalculate totals
      this.recalculatePortfolioTotals(portfolio);

      return await this.updatePortfolio(userId, portfolio);
    } catch (error) {
      console.error("Execute buy error:", error);
      return false;
    }
  }

  async executeSell(
    userId: string,
    propertyId: string,
    amountMMK: number
  ): Promise<boolean> {
    try {
      const portfolio = await this.getPortfolio(userId);
      if (!portfolio) return false;

      const property = await this.getPropertyById(propertyId);
      if (!property) return false;

      const existingHoldingIndex = portfolio.holdings.findIndex(
        h => h.propertyId === propertyId
      );

      if (existingHoldingIndex < 0) return false;

      const existingHolding = portfolio.holdings[existingHoldingIndex];
      
      // Check if user has enough shares to sell
      if (existingHolding.userValueMMK < amountMMK) return false;

      // Calculate new values
      const newValue = existingHolding.userValueMMK - amountMMK;
      const newSharePct = (newValue / property.currentValueMMK) * 100;

      if (newValue <= 0) {
        // Remove holding completely
        portfolio.holdings.splice(existingHoldingIndex, 1);
      } else {
        // Update existing holding
        const sellRatio = amountMMK / existingHolding.userValueMMK;
        const soldPurchaseValue = existingHolding.purchaseValueMMK * sellRatio;
        
        portfolio.holdings[existingHoldingIndex] = {
          ...existingHolding,
          userSharePct: newSharePct,
          userValueMMK: newValue,
          purchaseValueMMK: existingHolding.purchaseValueMMK - soldPurchaseValue,
          pnlAbs: newValue - (existingHolding.purchaseValueMMK - soldPurchaseValue),
          pnlPct: ((newValue - (existingHolding.purchaseValueMMK - soldPurchaseValue)) / (existingHolding.purchaseValueMMK - soldPurchaseValue)) * 100,
        };
      }

      // Create activity
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        type: "sell",
        propertyId,
        amountMMK,
        ts: Date.now(),
        description: `Sold ${((amountMMK / property.currentValueMMK) * 100).toFixed(2)}% of ${property.name}`,
      };

      // Update portfolio
      portfolio.cashMMK += amountMMK;
      portfolio.activities.unshift(newActivity);
      portfolio.activities = portfolio.activities.slice(0, 10); // Keep only 10 latest activities

      // Recalculate totals
      this.recalculatePortfolioTotals(portfolio);

      return await this.updatePortfolio(userId, portfolio);
    } catch (error) {
      console.error("Execute sell error:", error);
      return false;
    }
  }

  async simulateMarketChange(deltaPct: number): Promise<boolean> {
    try {
      // Update all property values
      for (const property of this.db.properties) {
        property.currentValueMMK *= (1 + deltaPct / 100);
      }

      // Update all portfolios
      for (const userId in this.db.portfolios) {
        const portfolio = this.db.portfolios[userId];
        
        // Update holdings
        for (const holding of portfolio.holdings) {
          const property = this.db.properties.find(p => p.id === holding.propertyId);
          if (property) {
            const newUserValue = (holding.userSharePct / 100) * property.currentValueMMK;
            holding.userValueMMK = newUserValue;
            holding.pnlAbs = newUserValue - holding.purchaseValueMMK;
            holding.pnlPct = (holding.pnlAbs / holding.purchaseValueMMK) * 100;
          }
        }

        // Recalculate portfolio totals
        this.recalculatePortfolioTotals(portfolio);
        
        // Update in database
        await this.updatePortfolio(userId, portfolio);
      }

      return true;
    } catch (error) {
      console.error("Simulate market change error:", error);
      return false;
    }
  }

  // Helper Methods
  private recalculatePortfolioTotals(portfolio: Portfolio): void {
    const totalValue = portfolio.holdings.reduce((sum, h) => sum + h.userValueMMK, 0);
    const totalPnl = portfolio.holdings.reduce((sum, h) => sum + h.pnlAbs, 0);
    const totalPurchaseValue = portfolio.holdings.reduce((sum, h) => sum + h.purchaseValueMMK, 0);

    portfolio.totalValueMMK = totalValue;
    portfolio.netPnlAbs = totalPnl;
    portfolio.netPnlPct = totalPurchaseValue > 0 ? (totalPnl / totalPurchaseValue) * 100 : 0;

    // Update snapshot
    portfolio.snapshot.weightedSharePct = totalValue > 0 ? 
      (totalValue / portfolio.snapshot.companyValueMMK) * 100 : 0;
  }

  // Initialize database from AsyncStorage
  async initializeFromStorage(): Promise<void> {
    try {
      // Load portfolios
      const storedPortfolios = await AsyncStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (storedPortfolios) {
        this.db.portfolios = { ...this.db.portfolios, ...JSON.parse(storedPortfolios) };
      }

      // Load users
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        const usersData = JSON.parse(storedUsers);
        this.db.users = [...usersData.users];
      }

      // Load properties
      const storedProperties = await AsyncStorage.getItem(PROPERTIES_STORAGE_KEY);
      if (storedProperties) {
        const propertiesData = JSON.parse(storedProperties);
        this.db.properties = [...propertiesData.properties];
      }

      // Load dynamic properties and combine with static
      await this.loadDynamicProperties();
    } catch (error) {
      console.error("Initialize from storage error:", error);
    }
  }

  // Development/Testing utilities
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEY,
        PORTFOLIO_STORAGE_KEY,
        USERS_STORAGE_KEY,
        PROPERTIES_STORAGE_KEY,
        DYNAMIC_PROPERTIES_STORAGE_KEY
      ]);
      
      // Reset to original data
      this.db = {
        users: usersData.users,
        portfolios: portfoliosData.portfolios as unknown as { [userId: string]: Portfolio },
        properties: propertiesData.properties as unknown as Property[],
        dynamicProperties: [],
      };
      
      console.log("All data cleared and reset to original state");
    } catch (error) {
      console.error("Clear all data error:", error);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.users;
  }

  // ===== PROPERTY CRUD OPERATIONS (ADMIN) =====

  // Load dynamic properties from AsyncStorage
  async loadDynamicProperties(): Promise<void> {
    try {
      const dynamicData = await AsyncStorage.getItem(DYNAMIC_PROPERTIES_STORAGE_KEY);
      if (dynamicData) {
        this.db.dynamicProperties = JSON.parse(dynamicData);
        // Combine static + dynamic properties
        this.db.properties = [
          ...propertiesData.properties as unknown as Property[],
          ...this.db.dynamicProperties
        ];
      }
    } catch (error) {
      console.error("Load dynamic properties error:", error);
    }
  }

  // Save dynamic properties to AsyncStorage
  async saveDynamicProperties(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        DYNAMIC_PROPERTIES_STORAGE_KEY,
        JSON.stringify(this.db.dynamicProperties)
      );
    } catch (error) {
      console.error("Save dynamic properties error:", error);
    }
  }

  // Create new property (Admin)
  async createProperty(propertyData: Omit<Property, "id">): Promise<Property | null> {
    try {
      const newProperty: Property = {
        ...propertyData,
        id: `prop-${Date.now()}`, // Generate unique ID
      };

      // Add to dynamic properties
      this.db.dynamicProperties.push(newProperty);
      
      // Update combined properties list
      this.db.properties = [
        ...propertiesData.properties as unknown as Property[],
        ...this.db.dynamicProperties
      ];

      // Save to AsyncStorage
      await this.saveDynamicProperties();

      return newProperty;
    } catch (error) {
      console.error("Create property error:", error);
      return null;
    }
  }

  // Update property (Admin)
  async updateProperty(propertyId: string, updateData: Partial<Property>): Promise<boolean> {
    try {
      // Check if it's a static property (read-only)
      const staticProperty = propertiesData.properties.find(p => p.id === propertyId);
      if (staticProperty) {
        console.log("Cannot edit static property");
        return false; // Static properties cannot be edited
      }

      // Find in dynamic properties
      const dynamicIndex = this.db.dynamicProperties.findIndex(p => p.id === propertyId);
      if (dynamicIndex === -1) return false;

      // Update the property
      this.db.dynamicProperties[dynamicIndex] = {
        ...this.db.dynamicProperties[dynamicIndex],
        ...updateData,
        id: propertyId, // Ensure ID doesn't change
      };

      // Update combined properties list
      this.db.properties = [
        ...propertiesData.properties as unknown as Property[],
        ...this.db.dynamicProperties
      ];

      // Save to AsyncStorage
      await this.saveDynamicProperties();

      return true;
    } catch (error) {
      console.error("Update property error:", error);
      return false;
    }
  }

  // Delete property (Admin)
  async deleteProperty(propertyId: string): Promise<boolean> {
    try {
      // Check if it's a static property (read-only)
      const staticProperty = propertiesData.properties.find(p => p.id === propertyId);
      if (staticProperty) {
        console.log("Cannot delete static property");
        return false; // Static properties cannot be deleted
      }

      // Find and remove from dynamic properties
      const dynamicIndex = this.db.dynamicProperties.findIndex(p => p.id === propertyId);
      if (dynamicIndex === -1) return false;

      this.db.dynamicProperties.splice(dynamicIndex, 1);

      // Update combined properties list
      this.db.properties = [
        ...propertiesData.properties as unknown as Property[],
        ...this.db.dynamicProperties
      ];

      // Save to AsyncStorage
      await this.saveDynamicProperties();

      return true;
    } catch (error) {
      console.error("Delete property error:", error);
      return false;
    }
  }

  // Get property type (static vs dynamic)
  getPropertyType(propertyId: string): "static" | "dynamic" | null {
    const staticProperty = propertiesData.properties.find(p => p.id === propertyId);
    if (staticProperty) return "static";

    const dynamicProperty = this.db.dynamicProperties.find(p => p.id === propertyId);
    if (dynamicProperty) return "dynamic";

    return null;
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
