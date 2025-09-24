import ExampleDropdownMenu from "@/example/example-dropdown-menu";
import ExampleBottomSheet from "@/example/example-bottom-sheet";
import ExampleDatePicker from "@/example/example-date-picker";
import ExampleToast from "@/example/example-toast";
import { ArrowRightIcon } from "lucide-react";
import routes from "@/libs/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex size-full flex-col items-center justify-center p-5">
      <div className="flex flex-col gap-y-7 sm:gap-y-9">
        <div className="sm:px-15 flex gap-x-2 sm:scale-150">
          <span className="flex">
            <Image className="dark:hidden" src="" alt="" width={156} height={25} priority />
            <Image
              className="hidden dark:block"
              src=""
              alt=""
              width={156}
              height={25}
              priority
            />
          </span>
          +
          <Image className="dark:invert" src="" alt="" width={71} height={15} priority />
        </div>
        <ul className="flex flex-col gap-y-2 text-left text-sm/6">
          <li>
            1. Get started by editing <code className="rounded bg-black/10 px-1 py-0.5 font-mono font-semibold dark:bg-white/15">app/page.tsx</code>.
          </li>
          <li>2. Save and see your changes instantly.</li>
          <li>3. Take a look at these custom components:</li>
          <li className="ml-4 flex max-w-md flex-wrap gap-2">
            <ExampleBottomSheet />
            <ExampleDropdownMenu />
            <ExampleToast />
            <ExampleDatePicker />
          </li>
        </ul>
        <div className="flex justify-start">
          <Link
            href={routes.bonus}
            className="group relative flex items-center gap-x-2 rounded-full bg-black px-4 py-2 text-sm text-white dark:bg-white dark:font-medium dark:text-black"
          >
            Bonus <ArrowRightIcon className="size-5 opacity-75 transition-all duration-100 ease-in group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
}
