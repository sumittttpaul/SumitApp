"use client";

import type { ThemeProviderProps } from "next-themes";
import dynamic from "next/dynamic";

const NextThemesProvider = dynamic<ThemeProviderProps>(() => import("next-themes").then((e) => e.ThemeProvider), { ssr: false });

export default function ThemeSwitchProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}
