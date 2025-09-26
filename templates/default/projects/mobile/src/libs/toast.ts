import SafeAreaInsetState from "@/states/safeareainset-state";
import Snackbar from "react-native-snackbar";

export default function showToast(message: string) {
  const { bottomInset } = SafeAreaInsetState();

  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_LONG,
    closeIcon: "ic_custom_close",
    marginBottom: bottomInset + 20,
  } as any);
}
