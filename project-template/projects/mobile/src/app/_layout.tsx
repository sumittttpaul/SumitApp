import { GestureHandlerRootView as RootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import RootHandler from "@/libs/root-handler";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";

import "core-js/actual/structured-clone";
import "react-native-url-polyfill/auto";
import "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

// void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true });

const style = StyleSheet.create({ root: { flex: 1, backgroundColor: "#0D0D0F" } });

export default function RootLayout() {
  return (
    <RootView style={style.root}>
      <SafeAreaProvider>
        <RootHandler>
          <Stack screenOptions={{ headerShown: false, contentStyle: style.root }}>
            <Stack.Screen name="index" />
          </Stack>
        </RootHandler>
      </SafeAreaProvider>
    </RootView>
  );
}
