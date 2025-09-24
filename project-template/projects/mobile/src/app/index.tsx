import { View, StyleSheet, Text } from "react-native";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Image } from "expo-image";

const styles = StyleSheet.create({
  turborepo: { width: 156, height: 25 },
  expo: { width: 71, height: 15 },
});

export default function Index() {
  return (
    <View className="relative size-full flex-1 overflow-x-hidden antialiased">
      <Header />
      <View className="flex flex-1 flex-col items-start justify-center p-5">
        <View className="flex flex-col gap-y-7">
          <View className="flex flex-row items-center gap-x-2">
            <Image
              style={styles.turborepo}
              source={{
                uri: "https://raw.githubusercontent.com/sumittttpaul/SumitApp/e691526c5ee138e8f1d2239754fe6c916fa36f4d/assets/turborepo-light.svg",
              }}
            />
            <Text className="text-2xl text-white">+</Text>

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
                <Text className="font-mono font-semibold text-white">app/page.tsx</Text>
              </View>
              <Text className="text-left text-lg/7 text-white">.</Text>
            </View>
            <Text className="text-left text-lg/7 text-white">2. Save and see your changes instantly.</Text>
            <Text className="text-left text-lg/7 text-white">3. Take a look at these custom components:</Text>
            {/* <View className="ml-4 flex max-w-md flex-wrap gap-2">
              <ExampleBottomSheet />
              <ExampleDropdownMenu />
              <ExampleToast />
              <ExampleDatePicker />
            </View> */}
          </View>
        </View>
      </View>
      <Footer />
    </View>
  );
}
