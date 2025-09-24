import LineContainer from "@/components/line-container";

export default function ComponentSection() {
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
        <p className="top-0 -left-[var(--gutter-width)] origin-bottom-right text-left font-mono text-xs font-bold tracking-widest text-amber-500 uppercase max-2xl:leading-6 sm:font-semibold 2xl:absolute 2xl:-translate-x-full 2xl:-translate-y-full 2xl:-rotate-90 2xl:text-right dark:text-amber-400">
          Element Studio
        </p>
      </LineContainer>
      <LineContainer className="order-3 px-2 max-sm:px-4">
        <h1 className="text-2xl font-medium tracking-tighter text-balance sm:text-3xl lg:text-4xl">
          Components & building blocks for device ready apps.
        </h1>
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
          Explore all the essential components and building blocks that power your apps, enabling seamless functionality, smooth performance, and full
          customization for any device.
        </p>
      </LineContainer>
      <LineContainer className="order-6 mt-10 max-sm:mt-8">
        <div className="grid w-full grid-flow-dense grid-cols-2 gap-2 bg-black/5 p-2 dark:bg-white/10">
          <div className="bg-background @container isolate col-span-full flex flex-col gap-2 overflow-hidden rounded-2xl p-2 outline outline-black/5 dark:outline-white/10">
            <div className="relative h-112 overflow-hidden rounded-lg bg-black/[2.5%] bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed p-4 [--pattern-fg:var(--color-black)]/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-black/5 sm:p-8 dark:bg-white/[2.5%] dark:[--pattern-fg:var(--color-white)]/10 dark:after:inset-ring-white/10"></div>
          </div>
          <div className="bg-background @container isolate col-span-full flex flex-col gap-2 overflow-hidden rounded-2xl p-2 outline outline-black/5 md:col-span-1 dark:outline-white/10">
            <div className="relative h-112 overflow-hidden rounded-lg bg-black/[2.5%] bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed p-4 [--pattern-fg:var(--color-black)]/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-black/5 sm:p-8 dark:bg-white/[2.5%] dark:[--pattern-fg:var(--color-white)]/10 dark:after:inset-ring-white/10"></div>
          </div>
          <div className="bg-background @container isolate col-span-full flex flex-col gap-2 overflow-hidden rounded-2xl p-2 outline outline-black/5 md:col-span-1 dark:outline-white/10">
            <div className="relative h-112 overflow-hidden rounded-lg bg-black/[2.5%] bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed p-4 [--pattern-fg:var(--color-black)]/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-black/5 sm:p-8 dark:bg-white/[2.5%] dark:[--pattern-fg:var(--color-white)]/10 dark:after:inset-ring-white/10"></div>
          </div>
        </div>
      </LineContainer>
    </section>
  );
}
