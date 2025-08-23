import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useBottomInsetPadding = (defaultPadding: number = 10) => {
  const insets = useSafeAreaInsets();
  const paddingBottom =
    Platform.OS === "android" && insets.bottom > defaultPadding
      ? insets.bottom
      : 0;

  return paddingBottom;
};

export const useInsetsTabBarStyle = () => {
  const insets = useSafeAreaInsets();
  const height =
    60 + (Platform.OS === "android" && insets.bottom > 25 ? insets.bottom : 25);
  const paddingBottom =
    Platform.OS === "android" && insets.bottom > 25 ? insets.bottom : 0;
  const paddingTop = Platform.OS === "android" ? 5 : 10;

  return {
    height,
    paddingBottom,
    paddingTop,
  };
};

export const useTopInsetPadding = () => {
  const insets = useSafeAreaInsets();
  return insets.top;
};

export const useSafeBottomPadding = (defaultPadding = 40) => {
  const insets = useSafeAreaInsets();

  return {
    paddingBottom:
      Platform.OS === "android" && insets.bottom > 25
        ? insets.bottom
        : defaultPadding,
  };
};
