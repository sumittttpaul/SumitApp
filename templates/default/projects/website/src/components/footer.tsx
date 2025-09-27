import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex w-full justify-between p-5 max-sm:flex-col max-sm:gap-y-2 max-sm:px-2 max-sm:text-center">
      <p className="text-foreground/60 text-sm/7 max-sm:text-xs/6">Copyright © 2025 Sumit Paul</p>
      <p className="text-foreground/60 text-sm/7 max-sm:text-xs/6">
        Design by{" "}
        <Link href="https://sumitttpaul.vercel.app/" className="underline-offset-2 hover:underline">
          Sumit Paul
        </Link>
        <span className="mx-2">•</span>
        <Link href="https://www.linkedin.com/in/sumitttpaul/" className="underline-offset-2 hover:underline">
          LinkedIn
        </Link>
      </p>
    </footer>
  );
}
