import Button from "@/components/button";
import { Text } from "react-native";

export default function ExampleDatePicker() {
  return (
    <Button type="outline" wrapperClassName="rounded-full" className="px-5 py-1">
      <Text className="text-sm/7 text-white">Date picker</Text>
    </Button>
  );
}
