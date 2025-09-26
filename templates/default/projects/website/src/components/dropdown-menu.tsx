"use client";

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import type { OverlayPlacement } from "@heroui/aria-utils";
import { useMediaQuery } from "@mui/material";
import Tooltip from "@/components/tooltip";

type Props = {
  open?: boolean;
  tooltip?: string;
  mode?: "normal" | "with-bottom-sheet";
  placement?: OverlayPlacement;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  items: { content: React.ReactNode; closeOnSelect?: boolean }[];
} & React.PropsWithChildren;

export default function DropDownMenu({ children, tooltip, items, open, setOpen, placement = "bottom-end", mode = "normal" }: Props) {
  const isDesktop = useMediaQuery("(min-width:768px)");
  const shouldUseDrawer = mode === "with-bottom-sheet" && !isDesktop;

  const renderTrigger = (trigger: React.ReactNode) =>
    tooltip ? (
      <Tooltip text={tooltip}>
        <span>{trigger}</span>
      </Tooltip>
    ) : (
      trigger
    );

  const itemClassName = "bg-transparent! focus:bg-transparent! active:bg-transparent! md:hover:bg-transparent! m-0 cursor-default p-0";

  if (shouldUseDrawer) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        {renderTrigger(<DrawerTrigger asChild>{children}</DrawerTrigger>)}
        <DrawerContent>
          <DrawerTitle className="sr-only" />
          {items.map((data, index) => (
            <div key={index} className={itemClassName}>
              {data.content}
            </div>
          ))}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dropdown isOpen={open} onOpenChange={setOpen} shadow="none" backdrop="blur" placement={placement} className="bg-popover">
      {renderTrigger(<DropdownTrigger>{children}</DropdownTrigger>)}
      <DropdownMenu className="flex w-full flex-col p-0">
        {items.map((data, index) => (
          <DropdownItem key={index} closeOnSelect={data.closeOnSelect ?? false} className={itemClassName}>
            {data.content}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
