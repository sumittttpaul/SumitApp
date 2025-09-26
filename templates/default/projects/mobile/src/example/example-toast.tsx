import Button from "@/components/button";
import showToast from "@/libs/toast";
import { Text } from "react-native";

export default function ExampleToast() {
  const handleClick = () => showToast("This is an example toast!");

  return (
    <Button type="outline" color="#ffffff20" wrapperClassName="rounded-full" className="px-6 py-2" onClick={handleClick}>
      <Text className="text-lg/7 text-white">Toast</Text>
    </Button>
  );
}
