import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import Button from "@/components/button";
import routes from "@/libs/navigation";
import { Image } from "expo-image";

const styles = StyleSheet.create({
  github: { width: 30, height: 30, borderRadius: 999 },
  logo: { width: 144, height: 48 },
});

export default function Header() {
  const { top: topInset } = useSafeAreaInsets();
  const { push: navigate } = useRouter();

  const handleClick = () => navigate(routes.home);

  const paddingTop = topInset + 4;

  return (
    <View style={{ paddingTop }} className="flex w-full flex-row items-center justify-between gap-y-2.5 px-2 pb-3">
      <Button onClick={handleClick}>
        <Image
          style={styles.logo}
          source={{
            uri: "https://raw.githubusercontent.com/sumittttpaul/SumitApp/e691526c5ee138e8f1d2239754fe6c916fa36f4d/assets/sumitapp-light.svg",
          }}
        />
      </Button>
      <Link href="https://github.com/sumittttpaul/SumitApp" className="flex rounded-full border border-white/20 p-1">
        <Image
          style={styles.github}
          source={{ uri: "https://raw.githubusercontent.com/sumittttpaul/SumitApp/e691526c5ee138e8f1d2239754fe6c916fa36f4d/assets/github-light.svg" }}
        />
      </Link>
    </View>
  );
}
