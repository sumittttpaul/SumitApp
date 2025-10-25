import BottomSheetState from "@/states/bottomsheet-state";
import { useSelector } from "@legendapp/state/react";
import BottomSheet from "@/components/bottom-sheet";
import Button from "@/components/button";
import { Text } from "react-native";
import { useEffect } from "react";
import { useRef } from "react";

export function ExampleBottomSheetContent() {
  const { setExampleBottomSheet } = useSelector(BottomSheetState);
  const bottomSheet = useRef(null);

  useEffect(() => {
    setExampleBottomSheet({ ref: bottomSheet });
  }, []);

  return (
    <BottomSheet ref={bottomSheet} className="pt-10">
      <Text className="h-48 text-center text-lg/7 text-white">This is an example bottom sheet!</Text>
    </BottomSheet>
  );
}

export default function ExampleBottomSheet() {
  const { openExampleBottomSheet } = useSelector(BottomSheetState);

  return (
    <Button type="outline" color="#ffffff20" wrapperClassName="rounded-full" className="px-6 py-2" onClick={openExampleBottomSheet}>
      <Text className="text-lg/7 text-white">Bottom sheet</Text>
    </Button>
  );
}
