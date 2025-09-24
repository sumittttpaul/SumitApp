import { cn } from "@/utils/cn";

export default function LineContainer({
  as: Component = "div",
  children,
  className,
  singleLine,
}: {
  className?: string;
  singleLine?: "top" | "bottom";
  as?: React.ElementType;
} & React.PropsWithChildren) {
  return (
    <Component
      aria-hidden="true"
      className={cn(
        "relative flex w-full",
        !singleLine &&
          "before:absolute before:top-0 before:-left-[100vw] before:h-px before:w-[200vw] before:bg-black/5 after:absolute after:bottom-0 after:-left-[100vw] after:h-px after:w-[200vw] after:bg-black/5 dark:before:bg-white/10 dark:after:bg-white/10",
        singleLine === "top"
          ? "before:absolute before:top-0 before:-left-[100vw] before:h-px before:w-[200vw] before:bg-black/5 dark:before:bg-white/10"
          : "after:absolute after:bottom-0 after:-left-[100vw] after:h-px after:w-[200vw] after:bg-black/5 dark:after:bg-white/10",
        className,
      )}
    >
      {children}
    </Component>
  );
}
