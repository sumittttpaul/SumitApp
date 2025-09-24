import CopyToClipboard from "@/components/copy-to-clipboard";
import LineContainer from "@/components/line-container";

export default function IntroSection() {
  return (
    <section className="flex flex-col">
      <div
        aria-hidden="true"
        className="order-2 flex h-0 items-end px-2 font-mono text-xs/6 whitespace-pre text-black/20 max-sm:px-4 2xl:order-1 dark:text-white/25"
      >
        <span className="hidden max-sm:inline">text-4xl </span>
        <span className="hidden sm:max-md:inline">text-5xl </span>
        <span className="hidden lg:max-xl:inline">text-6xl </span>
        <span className="hidden xl:inline">text-7xl tracking-tighter </span>
        <span className="inline dark:hidden">text-black </span>
        <span className="hidden dark:inline">text-white </span>
        <span className="max-sm:hidden">text-balance </span>font-medium
      </div>
      <LineContainer singleLine="bottom" className="order-1 items-end max-2xl:mb-6 max-2xl:px-2 max-sm:px-4 2xl:order-2 2xl:after:hidden">
        <p className="top-0 -left-[var(--gutter-width)] origin-bottom-right text-left font-mono text-xs font-bold tracking-widest text-sky-500 uppercase max-2xl:leading-6 sm:font-semibold 2xl:absolute 2xl:-translate-x-full 2xl:-translate-y-full 2xl:-rotate-90 2xl:text-right dark:text-sky-400">
          Why Sumit App?
        </p>
      </LineContainer>
      <LineContainer className="order-3 px-2 max-sm:px-4">
        <h1 className="text-4xl font-medium tracking-tighter text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
          Rapidly build modern apps with everything pre-configured and ready to use.
        </h1>
      </LineContainer>
      <div
        aria-hidden="true"
        className="order-4 flex h-6 items-end px-2 font-mono text-xs/6 whitespace-pre text-black/20 max-sm:px-4 sm:h-10 dark:text-white/25"
      >
        text-lg <span className="inline dark:hidden">text-black</span>
        <span className="hidden dark:inline">text-white</span> font-medium opacity-60
      </div>
      <LineContainer className="order-5 px-2 max-sm:px-4">
        <p className="text-md/6 max-w-(--breakpoint-md) font-medium text-black/60 sm:text-lg/7 dark:text-white/60">
          A monorepo pre-configured project powered by{" "}
          <span className="font-mono font-bold text-pink-500 dark:font-medium dark:text-pink-400">Turborepo</span>, featuring a{" "}
          <span className="font-mono font-bold text-cyan-500 dark:font-medium dark:text-cyan-400">Next.js</span> web app, an{" "}
          <span className="font-mono font-bold text-green-500 dark:font-medium dark:text-green-400">Expo</span> mobile app, and{" "}
          <span className="font-mono font-bold text-orange-500 dark:font-medium dark:text-orange-400">Node.js</span> Vercel serverless APIs.
        </p>
      </LineContainer>
      <LineContainer className="order-6 mt-10 px-2 max-sm:mt-8 max-sm:px-4">
        <CopyToClipboard>npx create-sumit-app</CopyToClipboard>
      </LineContainer>
    </section>
  );
}
