import { TooltipContent, TooltipTrigger, TooltipComponent } from "@/components/ui/tooltip";

export default function Tooltip({ children, text }: { text: string } & React.PropsWithChildren) {
  return (
    <TooltipComponent>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="flex max-sm:hidden" side="top">
        <span className="font-normal dark:font-medium">{text}</span>
      </TooltipContent>
    </TooltipComponent>
  );
}
