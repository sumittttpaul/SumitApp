import Button from "@/components/button";
import DropdownMenu from "@/components/dropdown-menu";
import { Text } from "react-native";

export default function ExampleDropdownMenu() {
  return (
    <DropdownMenu
      items={[
        { icon: "ic_custom_help", title: "Help" },
        { icon: "ic_custom_feedback", title: "Feedback" },
      ]}
    >
      <Button type="outline" color="#ffffff20" wrapperClassName="rounded-full" className="px-6 py-2">
        <Text className="text-lg/7 text-white">Dropdown menu</Text>
      </Button>
    </DropdownMenu>
  );
}
