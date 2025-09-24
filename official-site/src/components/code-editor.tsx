import { PropsWithChildren } from "react";

export default function CodeEditor({ children }: PropsWithChildren) {
  return (
    <div className="bg-background outline-l-none size-full rounded-tl-xl pt-1 pl-2 outline outline-black/5 dark:outline-white/10">
      <div className="flex gap-2 p-2">
        <span className="size-3 rounded-full bg-black/15 dark:bg-white/20"></span>
        <span className="size-3 rounded-full bg-black/15 dark:bg-white/20"></span>
        <span className="size-3 rounded-full bg-black/15 dark:bg-white/20"></span>
      </div>
      <div className="bg-code-editor flex size-full overflow-auto rounded-tl-lg p-5 outline outline-black/5 max-sm:p-3 dark:outline-white/10">
        {children}
      </div>
    </div>
  );
}
