"use client";

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import Tooltip from "@/components/tooltip";

type props = {
  item: React.ReactNode;
  tooltip?: string;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
} & React.PropsWithChildren;

export default function BottomSheet({ children, tooltip, item, open, setOpen }: props) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {tooltip ? (
        <Tooltip text={tooltip}>
          <span>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
          </span>
        </Tooltip>
      ) : (
        <DrawerTrigger asChild>{children}</DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerTitle className="sr-only"></DrawerTitle>
        {item}
      </DrawerContent>
    </Drawer>
  );
}
