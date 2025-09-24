import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Inter from "@expo-google-fonts/inter";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";

const style = StyleSheet.create({
  topSafeArea: { top: 0, left: 0, right: 0, zIndex: 2000, position: "absolute" },
  bottomSafeArea: { left: 0, right: 0, bottom: 0, zIndex: 2000, position: "absolute" },
});

export default function RootHandler({ children }: React.PropsWithChildren) {
  const [fontLoaded, fontError] = useFonts({
    "inter-thin": Inter.Inter_100Thin,
    "inter-thin-italic": Inter.Inter_100Thin_Italic,
    "inter-extralight": Inter.Inter_200ExtraLight,
    "inter-extralight-italic": Inter.Inter_200ExtraLight_Italic,
    "inter-light": Inter.Inter_300Light,
    "inter-light-italic": Inter.Inter_300Light_Italic,
    "inter-regular": Inter.Inter_400Regular,
    "inter-regular-italic": Inter.Inter_400Regular_Italic,
    "inter-medium": Inter.Inter_500Medium,
    "inter-medium-italic": Inter.Inter_500Medium_Italic,
    "inter-semibold": Inter.Inter_600SemiBold,
    "inter-semibold-italic": Inter.Inter_600SemiBold_Italic,
    "inter-bold": Inter.Inter_700Bold,
    "inter-bold-italic": Inter.Inter_700Bold_Italic,
    "inter-extrabold": Inter.Inter_800ExtraBold,
    "inter-extrabold-italic": Inter.Inter_800ExtraBold_Italic,
    "inter-black": Inter.Inter_900Black,
    "inter-black-italic": Inter.Inter_900Black_Italic,
  });

  const { top: topHeight, bottom: bottomHeight } = useSafeAreaInsets();

  const topBackgroundColor = "#0D0D0FB6";
  const bottomBackgroundColor = "#000000EA";

  useEffect(() => {
    if (fontLoaded) void SplashScreen.hideAsync();
  }, [fontLoaded]);

  if (!fontLoaded && fontError) return null;

  return (
    <>
      <View style={[{ height: topHeight, backgroundColor: topBackgroundColor }, style.topSafeArea]} />
      {children}
      <View style={[{ height: bottomHeight, backgroundColor: bottomBackgroundColor }, style.bottomSafeArea]} />
    </>
  );
}
