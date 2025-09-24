"use client";

import { Switch, SwitchIndicator, SwitchWrapper } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn";

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme();

  const handleToggle = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <div className="flex items-center space-x-2.5">
      <SwitchWrapper permanent={true}>
        <Switch size="xl" checked={resolvedTheme === "dark"} onCheckedChange={handleToggle} />
        <SwitchIndicator state="on">
          <Sun className={cn(resolvedTheme === "dark" ? "text-white/60" : "text-muted-foreground", "size-4")} />
        </SwitchIndicator>
        <SwitchIndicator state="off">
          <Moon className={cn(resolvedTheme === "dark" ? "text-black/60" : "text-muted-foreground", "size-4")} />
        </SwitchIndicator>
      </SwitchWrapper>
    </div>
  );
}
