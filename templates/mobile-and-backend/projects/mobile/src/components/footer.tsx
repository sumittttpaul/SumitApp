import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Footer() {
  const { bottom: bottomInset } = useSafeAreaInsets();

  const paddingBottom = bottomInset + 20;

  return (
    <View style={{ paddingBottom }} className="flex w-full flex-col gap-y-2 px-2 pt-5">
      <Text className="text-center text-base/7 text-white opacity-60">Copyright © 2025 Sumit Paul</Text>
      <View className="flex flex-row justify-center gap-x-3 opacity-60">
        <View className="flex flex-row">
          <Text className="text-base/7 text-white">Design by </Text>
          <Link href="https://sumitttpaul.vercel.app/">
            <Text className="text-base/7 text-white underline-offset-2 hover:underline">Sumit Paul</Text>
          </Link>
        </View>
        <Text className="text-base/7 text-white">•</Text>
        <Link href="https://www.linkedin.com/in/sumitttpaul/">
          <Text className="text-base/7 text-white underline-offset-2 hover:underline">LinkedIn</Text>
        </Link>
      </View>
    </View>
  );
}
