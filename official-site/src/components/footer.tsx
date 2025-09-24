import LineContainer from "@/components/line-container";
import Link from "next/link";

export default function Footer() {
  return (
    <LineContainer as="footer" singleLine="top" className="flex w-full px-7 pt-5 pb-10 max-sm:flex-col max-sm:gap-y-2 max-sm:px-6 sm:justify-between">
      <p className="text-foreground/60 text-sm/7">Copyright © 2025 Sumit.App</p>
      <p className="text-foreground/60 text-sm/7">
        Design by{" "}
        <Link href="https://sumitttpaul.vercel.app/" className="underline-offset-2 hover:underline">
          Sumit Paul
        </Link>
        <span className="mx-2">•</span>
        <Link href="https://www.linkedin.com/in/sumitttpaul/" className="underline-offset-2 hover:underline">
          LinkedIn
        </Link>
      </p>
    </LineContainer>
  );
}
