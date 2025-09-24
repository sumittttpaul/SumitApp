"use client";

import { XIcon } from "lucide-react";

export default function Toast({ title, onExit }: { title?: string; onExit?: () => void }) {
  return (
    <div className="justify-self-center-safe relative flex max-w-[calc(100%)] items-center overflow-hidden rounded-xl bg-black p-1 text-white max-sm:gap-x-1 max-sm:p-2 sm:max-w-md dark:bg-white dark:text-black">
      <p className="truncate pl-3.5 text-base max-sm:pl-2">{title}</p>
      <button
        type="button"
        className="flex size-7 items-center justify-center rounded-full bg-transparent hover:bg-white/15 sm:size-11 dark:hover:bg-black/10"
        onClick={onExit}
      >
        <XIcon className="size-4.5 sm:size-5" />
      </button>
    </div>
  );
}
