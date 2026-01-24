import ExampleDropdownMenu from "@/example/example-dropdown-menu";
import ExampleBottomSheet from "@/example/example-bottom-sheet";
import ExampleDatePicker from "@/example/example-date-picker";
import { View, StyleSheet, Text } from "react-native";
import ExampleToast from "@/example/example-toast";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Image } from "expo-image";

const styles = StyleSheet.create({
  turborepo: { width: 168, height: 27 },
  expo: { width: 71, height: 20 },
});

export default function Index() {
  return (
    <View className="bg-background relative size-full flex-1 overflow-x-hidden antialiased">
      <Header />
      <View className="flex flex-1 flex-col items-start justify-center p-5">
        <View className="flex flex-col gap-y-7">
          <View className="flex flex-row items-center gap-x-2.5">
            <Image
              style={styles.turborepo}
              source={{
                uri: "https://raw.githubusercontent.com/sumittttpaul/SumitApp/e691526c5ee138e8f1d2239754fe6c916fa36f4d/assets/turborepo-light.svg",
              }}
            />
            <Text className="text-3xl text-white">+</Text>

            <Image
              style={styles.expo}
              source={{
                uri: "https://raw.githubusercontent.com/sumittttpaul/SumitApp/e691526c5ee138e8f1d2239754fe6c916fa36f4d/assets/expo-light.svg",
              }}
            />
          </View>
          <View className="flex flex-col gap-y-2">
            <View className="flex flex-row">
              <Text className="text-left text-lg/7 text-white">1. Get started by editing </Text>
              <View className="rounded bg-white/15 px-1 py-0.5">
                <Text className="font-mono font-bold text-white">app/index.tsx</Text>
              </View>
              <Text className="text-left text-lg/7 text-white">.</Text>
            </View>
            <Text className="text-left text-lg/7 text-white">2. Save and see your changes instantly.</Text>
            <Text className="text-left text-lg/7 text-white">3. Take a look at these custom components:</Text>
            <View className="ml-4 flex max-w-md flex-row flex-wrap gap-2">
              <ExampleDatePicker />
              <ExampleToast />
              <ExampleBottomSheet />
              <ExampleDropdownMenu />
            </View>
          </View>
        </View>
      </View>
      <Footer />
    </View>
  );
}
