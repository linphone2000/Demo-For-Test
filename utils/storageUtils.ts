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

/**
 * Log all AsyncStorage data to console
 */
export const logStorageData = async (): Promise<void> => {
  const data = await getAllStorageData();
  console.log("=== AsyncStorage Data ===");
  console.log(JSON.stringify(data, null, 2));
  console.log("========================");
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
