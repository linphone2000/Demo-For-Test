import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
}

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

const AUTH_STORAGE_KEY = "app_auth_user";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password combination
      // In a real app, you'd validate against your backend
      const user: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0], // Use email prefix as name for demo
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      console.error("Sign in error:", error);
      set({ isLoading: false });
      return false;
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create user directly
      // In a real app, you'd send this to your backend
      const user: User = {
        id: Date.now().toString(),
        email,
        name,
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      console.error("Sign up error:", error);
      set({ isLoading: false });
      return false;
    }
  },

  signOut: async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
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
      const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      
      if (userData) {
        const user: User = JSON.parse(userData);
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
