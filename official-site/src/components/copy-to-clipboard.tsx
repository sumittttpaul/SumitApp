import { CopyButton } from "@/components/ui/shadcn-io/copy-button";

export default function CopyToClipboard({ children, type }: { type?: "normal" | "code" } & React.PropsWithChildren) {
  if (type === "code") {
    return (
      <div className="bg-code-editor flex flex-col items-center justify-center gap-y-4 rounded-xl pt-1 pr-0 pb-3 pl-4">
        <div className="flex w-full items-center justify-between">
          <h6 className="text-sm">bash</h6>
          <div className="flex items-center">
            <CopyButton content={children as string} variant="secondary" size="text" className="scale-80 bg-transparent" />
          </div>
        </div>
        <p className="w-full text-start font-mono text-base select-text max-sm:text-sm">{children}</p>
      </div>
    );
  }

  return (
    <div className="bg-input flex items-center justify-center rounded-xl pr-0.5 pl-4">
      <span className="font-mono text-base select-text max-sm:text-sm">{children}</span>
      <CopyButton content={children as string} variant="muted" size="md" className="scale-80 bg-transparent" />
    </div>
  );
}
