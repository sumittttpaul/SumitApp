import LineContainer from "@/components/line-container";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";
import Link from "next/link";

const technologies = [
  {
    companyLogo: "https://raw.githubusercontent.com/sumittttpaul/SumitApp/f7860e9c03e5719fa271285369720333e27e9a63/assets/vercel-dark.svg",
    companyWebsiteUrl: "https://vercel.com",
  },
  {
    companyLogo: "https://raw.githubusercontent.com/sumittttpaul/SumitApp/41be55e71005a1248d893f8a89128b9ab04c9875/assets/nodejs-dark.svg",
    companyWebsiteUrl: "https://nodejs.org",
  },
  {
    companyLogo: "https://raw.githubusercontent.com/sumittttpaul/SumitApp/a7a0af2825033912574d7ae34e580e9cdb820261/assets/nextjs-dark.svg",
    companyWebsiteUrl: "https://nextjs.org",
  },
  {
    companyLogo: "https://raw.githubusercontent.com/sumittttpaul/SumitApp/41e6e185865747829a100d62cca716ab0eabd030/assets/turborepo-short-dark.svg",
    companyWebsiteUrl: "https://turborepo.com",
  },
  {
    companyLogo: "https://raw.githubusercontent.com/sumittttpaul/SumitApp/41be55e71005a1248d893f8a89128b9ab04c9875/assets/expo-dark.svg",
    companyWebsiteUrl: "https://expo.dev",
  },
  {
    companyLogo: "https://raw.githubusercontent.com/sumittttpaul/SumitApp/f7860e9c03e5719fa271285369720333e27e9a63/assets/typescript-dark.svg",
    companyWebsiteUrl: "https://www.typescriptlang.org",
  },
];

function CompanyLogo({ key, companyLogo, companyWebsiteUrl }: { key?: number; companyLogo: string; companyWebsiteUrl: string }) {
  return (
    <Link
      key={key}
      href={companyWebsiteUrl as any}
      className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg p-5 transition-all duration-100 ease-in active:scale-90 sm:hover:bg-black/5 dark:sm:hover:bg-white/5"
    >
      <span className="relative h-10 w-42 max-sm:h-7 max-sm:w-28">
        <Image className="bg-cover object-contain grayscale-100 dark:invert" src={companyLogo} alt="" priority fill />
      </span>
    </Link>
  );
}

export default function TechStackSection() {
  return (
    <section className="flex flex-col">
      <div
        aria-hidden="true"
        className="order-2 flex h-0 items-end px-2 font-mono text-xs/6 whitespace-pre text-black/20 max-sm:px-4 2xl:order-1 dark:text-white/25"
      >
        <span className="hidden max-sm:inline">text-2xl </span>
        <span className="hidden sm:max-md:inline">text-3xl </span>
        <span className="hidden lg:inline">text-4xl tracking-tighter </span>
        <span className="inline dark:hidden">text-black </span>
        <span className="hidden dark:inline">text-white </span>
        <span className="max-sm:hidden">text-balance </span>font-medium
      </div>
      <LineContainer singleLine="bottom" className="order-1 items-end max-2xl:mb-6 max-2xl:px-2 max-sm:px-4 2xl:order-2 2xl:after:hidden">
        <p className="top-0 -left-[var(--gutter-width)] origin-bottom-right text-left font-mono text-xs font-bold tracking-widest text-fuchsia-500 uppercase max-2xl:leading-6 sm:font-semibold 2xl:absolute 2xl:-translate-x-full 2xl:-translate-y-full 2xl:-rotate-90 2xl:text-right dark:text-fuchsia-400">
          Creation Station
        </p>
      </LineContainer>
      <LineContainer className="order-3 px-2 max-sm:px-4">
        <h1 className="text-2xl font-medium tracking-tighter text-balance sm:text-3xl lg:text-4xl">Engines driving every aspect of the project.</h1>
      </LineContainer>
      <div
        aria-hidden="true"
        className="order-4 flex h-6 items-end px-2 font-mono text-xs/6 whitespace-pre text-black/20 max-sm:px-4 sm:h-8 dark:text-white/25"
      >
        <span className="hidden max-sm:inline">text-sm </span>
        <span className="hidden sm:inline">text-base </span>
        <span className="inline dark:hidden">text-black </span>
        <span className="hidden dark:inline">text-white </span>font-medium opacity-60
      </div>
      <LineContainer className="order-5 px-2 max-sm:px-4">
        <p className="max-w-(--breakpoint-md) text-sm/5.5 font-medium text-black/60 sm:text-base/7 dark:text-white/60">
          Showcasing all the tools, frameworks, and technologies that power the project, from web and mobile apps to serverless APIs, delivering
          seamless performance, scalability, and flexibility.
        </p>
      </LineContainer>
      <LineContainer className="order-6 mt-10 max-sm:mt-8">
        <Marquee pauseOnHover className="bg-black/5 [--duration:30s] [--gap:6rem] max-sm:[--duration:20s] max-sm:[--gap:2rem] dark:bg-white/5">
          {technologies.map((data, index) => (
            <CompanyLogo key={index} {...data} />
          ))}
        </Marquee>
      </LineContainer>
    </section>
  );
}
