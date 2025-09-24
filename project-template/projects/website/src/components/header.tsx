import ThemeSwitch from "@/components/theme-switch";
import routes from "@/libs/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col gap-y-2.5">
      <div className="flex w-full items-center justify-between p-5 max-sm:px-2 max-sm:py-3">
        <Link href={routes.home} className="m-0 p-0">
          <Image
            className="max-sm:w-36 dark:invert"
            src="https://raw.githubusercontent.com/sumittttpaul/SumitApp/e691526c5ee138e8f1d2239754fe6c916fa36f4d/assets/sumitapp-dark.svg"
            height={60}
            width={180}
            alt="logo"
          />
        </Link>
        <div className="flex items-center gap-x-2">
          <Link
            href="https://github.com/sumittttpaul/SumitApp"
            className="hover:bg-input border-input flex gap-x-2.5 rounded-full border p-1 text-sm/7 hover:border-transparent active:scale-90 sm:pr-2.5"
          >
            <Image
              width={25}
              height={25}
              className="dark:invert"
              src="https://raw.githubusercontent.com/sumittttpaul/SumitApp/e691526c5ee138e8f1d2239754fe6c916fa36f4d/assets/github-dark.svg"
              alt=""
            />
            <span className="max-sm:hidden">GitHub</span>
          </Link>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
