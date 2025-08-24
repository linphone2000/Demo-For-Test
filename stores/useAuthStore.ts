import { create } from "zustand";
import { databaseService } from "@/services/mock/databaseService";
import { User } from "@/types/models";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  restoreAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Authenticate using database service
      const user = await databaseService.authenticateUser(email, password);
      
      if (user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      } else {
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      console.error("Sign in error:", error);
      set({ isLoading: false });
      return false;
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true });
      
      // Initialize database from storage
      await databaseService.initializeFromStorage();
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user in the database
      const user = await databaseService.createUser(email, password, name);
      
      if (user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      } else {
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      console.error("Sign up error:", error);
      set({ isLoading: false });
      return false;
    }
  },

  signOut: async () => {
    try {
      await databaseService.signOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  },

  restoreAuth: async () => {
    try {
      set({ isLoading: true });
      const user = await databaseService.getCurrentUser();
      
      if (user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Restore auth error:", error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
