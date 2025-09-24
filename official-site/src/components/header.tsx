import LineContainer from "@/components/line-container";
import ThemeSwitch from "@/components/theme-switch";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <LineContainer as="header" singleLine="bottom" className="bg-background/75 fixed top-0 z-40 flex-col text-black backdrop-blur-xl dark:text-white">
      <div className="mx-auto flex w-full max-w-[var(--breakpoint-2xl)] items-center justify-between p-2 max-sm:px-4 md:px-8 lg:px-12 2xl:px-2">
        <Image className="max-sm:w-36 dark:invert" src="" height={60} width={180} alt="" />
        <div className="flex items-center gap-x-2">
          <Link
            href="https://github.com/sumittttpaul/SumitApp"
            className="hover:bg-input border-input flex gap-x-2.5 rounded-full border p-1 text-sm/7 transition-all duration-100 ease-in hover:border-transparent active:scale-90 sm:pr-2.5"
          >
            <Image width={25} height={25} className="dark:invert" src="" alt="" />
            <span className="max-sm:hidden">GitHub</span>
          </Link>
          <ThemeSwitch />
        </div>
      </div>
    </LineContainer>
  );
}
