"use client";

import { PowerIcon, FolderIcon } from "@heroicons/react/24/outline";
import DropDownMenu from "@/components/dropdown-menu";
import Link from "next/link";

export default function ExampleDropdownMenu() {
  return (
    <DropDownMenu
      tooltip="Example dropdown menu"
      items={[
        {
          content: (
            <Link
              key="1"
              href="#"
              className="flex items-center justify-start gap-x-3 rounded-lg py-2.5 pr-20 pl-3 text-sm hover:bg-black/10 active:scale-90 sm:pr-24 sm:pl-3.5 sm:text-sm dark:hover:bg-white/10"
            >
              <FolderIcon className="stroke-1.5 text-foreground pointer-events-none size-5" />
              Manage my account
            </Link>
          ),
          closeOnSelect: true,
        },
        {
          content: (
            <Link
              key="2"
              href="#"
              className="flex items-center justify-start gap-x-3 rounded-lg py-2.5 pr-20 pl-3 text-sm hover:bg-black/10 active:scale-90 sm:pr-24 sm:pl-3.5 sm:text-sm dark:hover:bg-white/10"
            >
              <PowerIcon className="stroke-1.5 text-foreground pointer-events-none size-5" />
              Log out
            </Link>
          ),
          closeOnSelect: true,
        },
      ]}
    >
      <button
        type="button"
        className="hover:bg-input border-input flex rounded-full border px-5 py-1 text-sm/7 hover:border-transparent active:scale-90"
      >
        Dropdown menu
      </button>
    </DropDownMenu>
  );
}
