import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@packages/utils";
import { Children } from "react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm transition-all ease-in duration-200 active:scale-90 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm md:hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs md:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border border-input bg-background shadow-xs md:hover:bg-accent md:hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs md:hover:bg-secondary/80",
        ghost: "md:hover:bg-accent md:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 md:hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  // Check if we can safely use asChild
  const canUseasChild = asChild && Children.count(children) === 1;
  const Comp = canUseasChild ? Slot : "button";

  return (
    <Comp data-slot="button" className={cn(buttonVariants({ className, variant, size }))} {...props}>
      {children}
    </Comp>
  );
}
