import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Get all keys and values from AsyncStorage
 */
export const getAllStorageData = async (): Promise<Record<string, any>> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const data: Record<string, any> = {};
    
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      try {
        data[key] = value ? JSON.parse(value) : null;
      } catch {
        data[key] = value;
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error getting storage data:", error);
    return {};
  }
};

/**
 * Get a specific value from AsyncStorage
 */
export const getStorageItem = async (key: string): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return null;
  }
};

/**
 * Get all storage keys
 */
export const getStorageKeys = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys]; // Convert readonly array to mutable array
  } catch (error) {
    console.error("Error getting storage keys:", error);
    return [];
  }
};

/**
 * Clear all AsyncStorage data
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log("All AsyncStorage data cleared");
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

/**
 * Remove a specific key from AsyncStorage
 */
export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Removed storage item: ${key}`);
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error);
  }
};

export const logStorageData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const data = await AsyncStorage.multiGet(keys);
    console.log("Storage data:", data);
  } catch (error) {
    console.error("Error reading storage:", error);
  }
};

// Number formatting utilities
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
  }
  return new Intl.NumberFormat('en-US').format(num);
};

// Currency formatting utilities
export const formatMMK = (amount: number): string => {
  const formatted = formatNumber(amount);
  return formatted.includes('M') ? formatted + ' MMK' : new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MMK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatUSD = (amountMMK: number): string => {
  const usdAmount = amountMMK / 4400; // 1 USD = 4400 MMK
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdAmount);
};

/**
 * Get storage size information
 */
export const getStorageInfo = async (): Promise<{
  keys: string[];
  totalKeys: number;
  data: Record<string, any>;
}> => {
  const keys = await getStorageKeys();
  const data = await getAllStorageData();
  
  return {
    keys,
    totalKeys: keys.length,
    data,
  };
};
