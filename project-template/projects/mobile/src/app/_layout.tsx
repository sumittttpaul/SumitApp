import { GestureHandlerRootView as RootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MD3DarkTheme, PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { StyleSheet, View } from "react-native";
import RootHandler from "@/libs/root-handler";
import { lazy, Suspense } from "react";
import { Stack } from "expo-router";

import "core-js/actual/structured-clone";
import "react-native-url-polyfill/auto";
import "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true });

const ExampleBottomSheet = lazy(() => import("@/example/example-bottom-sheet").then((e) => ({ default: e.ExampleBottomSheetContent })));

const style = StyleSheet.create({ root: { flex: 1, backgroundColor: "#0a0a0a" } });

const PaperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    surface: "#252525",
    backdrop: "rgba(0, 0, 0, 0.7)",
  },
};

export default function RootLayout() {
  return (
    <RootView style={style.root}>
      <PaperProvider theme={PaperTheme}>
        <SafeAreaProvider>
          <RootHandler>
            {/* Stack */}
            <Suspense fallback={<View style={style.root} />}>
              <Stack screenOptions={{ headerShown: false, contentStyle: style.root }}>
                <Stack.Screen name="index" />
              </Stack>
            </Suspense>
            {/* Bottom sheet */}
            <Suspense fallback={null}>
              <ExampleBottomSheet />
            </Suspense>
          </RootHandler>
        </SafeAreaProvider>
      </PaperProvider>
    </RootView>
  );
}
