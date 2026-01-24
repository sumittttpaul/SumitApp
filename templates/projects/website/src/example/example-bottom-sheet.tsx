"use client";

import BottomSheet from "@/components/bottom-sheet";

export default function ExampleBottomSheet() {
  return (
    <BottomSheet
      tooltip="Example bottom sheet"
      item={<span className="flex h-[50vh] w-full items-center justify-center">Drawer content goes here</span>}
    >
      <button
        type="button"
        className="hover:bg-input border-input flex rounded-full border px-5 py-1 text-sm/7 hover:border-transparent active:scale-90"
      >
        Bottom sheet
      </button>
    </BottomSheet>
  );
}
