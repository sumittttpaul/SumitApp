import { CalendarCheck2Icon, MessageSquareDotIcon, PanelBottomOpenIcon, PictureInPicture2Icon, MoonIcon, LayoutDashboardIcon } from "lucide-react";
import LineContainer from "@/components/line-container";
import Image from "next/image";

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
            <div className="relative overflow-hidden rounded-lg bg-black/[2.5%] bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed p-4 [--pattern-fg:var(--color-black)]/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-black/5 sm:p-8 dark:bg-white/[2.5%] dark:[--pattern-fg:var(--color-white)]/10 dark:after:inset-ring-white/10">
              <div className="relative flex w-full items-center gap-x-2 overflow-hidden max-md:flex-col max-md:gap-y-5 md:max-h-[clamp(150px,35vw,500px)] md:justify-between">
                <span className="flex w-full justify-center">
                  <span className="flex h-auto w-full max-md:max-w-[427px] md:mb-[clamp(10px,5vw,90px)] md:max-h-[875px]">
                    <Image width={740} height={1514} src="/backend_android.png" className="max-md:object-cover" alt="" />
                  </span>
                </span>
                <span className="flex w-full justify-center">
                  <span className="flex h-auto w-full max-md:max-w-[427px] md:mt-[clamp(10px,5vw,90px)] md:max-h-[875px]">
                    <Image width={740} height={1514} src="/website_android.png" className="max-md:object-cover" alt="" />
                  </span>
                </span>
                <span className="flex w-full justify-center">
                  <span className="flex h-auto w-full max-md:max-w-[427px] md:mb-[clamp(10px,5vw,90px)] md:max-h-[875px]">
                    <Image width={740} height={1514} src="/mobile_android.png" className="max-md:object-cover" alt="" />
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="bg-background @container isolate col-span-full flex flex-col gap-2 overflow-hidden rounded-2xl p-2 outline outline-black/5 md:col-span-1 dark:outline-white/10">
            <div className="flex w-full flex-col p-8 max-sm:p-4">
              <div className="flex w-full flex-col gap-y-2.5">
                <h2 className="flex items-center gap-x-4 text-xl/8 font-medium @md:text-2xl/8">
                  <MoonIcon className="pointer-events-none size-7" /> Dark mode
                </h2>
                <p className="text-foreground/60 text-sm/7">
                  Dark mode support lets you enjoy a sleek, modern look that&apos;s easy on the eyes. Perfect for late-night use or low-light
                  environments.
                </p>
              </div>
            </div>
            <div className="relative mt-auto overflow-hidden rounded-lg bg-black/[2.5%] bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed p-4 [--pattern-fg:var(--color-black)]/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-black/5 sm:p-8 dark:bg-white/[2.5%] dark:[--pattern-fg:var(--color-white)]/10 dark:after:inset-ring-white/10">
              <div className="relative flex w-full items-center justify-between gap-x-2">
                <span className="flex w-full justify-center">
                  <span className="flex h-auto max-h-[500px] w-full max-w-[244px]">
                    <Image width={740} height={1514} src="/website_android.png" alt="" />
                  </span>
                </span>
                <span className="flex w-full justify-center">
                  <span className="flex h-auto max-h-[500px] w-full max-w-[244px]">
                    <Image width={740} height={1514} src="/website_android_light.png" alt="" />
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="bg-background @container isolate col-span-full flex flex-col gap-2 overflow-hidden rounded-2xl p-2 outline outline-black/5 md:col-span-1 dark:outline-white/10">
            <div className="flex w-full flex-col p-8 max-sm:p-4">
              <div className="flex w-full flex-col gap-y-2.5">
                <h2 className="flex items-center gap-x-4 text-xl/8 font-medium @md:text-2xl/8">
                  <PanelBottomOpenIcon className="pointer-events-none size-7" /> Bottom Sheet
                </h2>
                <p className="text-foreground/60 text-sm/7">
                  Bring important actions closer with a smooth slide-up panel. Perfect for mobile-first workflows and quick access.
                </p>
              </div>
            </div>
            <div className="relative mt-auto overflow-hidden rounded-lg bg-black/[2.5%] bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed p-4 [--pattern-fg:var(--color-black)]/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-black/5 sm:p-8 dark:bg-white/[2.5%] dark:[--pattern-fg:var(--color-white)]/10 dark:after:inset-ring-white/10">
              <div className="relative flex w-full items-center justify-between gap-x-2">
                <span className="flex w-full justify-center">
                  <span className="flex h-auto max-h-[500px] w-full max-w-[244px]">
                    <Image width={740} height={1514} src="/website_bottomsheet_android.png" alt="" />
                  </span>
                </span>
                <span className="flex w-full justify-center">
                  <span className="flex h-auto max-h-[500px] w-full max-w-[244px]">
                    <Image width={740} height={1514} src="/mobile_bottomsheet_android.png" alt="" />
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="bg-background @container isolate col-span-full flex flex-col gap-2 overflow-hidden rounded-2xl p-2 outline outline-black/5 dark:outline-white/10">
            <div className="flex w-full flex-col p-8 max-sm:p-4">
              <div className="flex w-full flex-col gap-y-2.5">
                <h2 className="flex items-center gap-x-4 text-xl/8 font-medium @md:text-2xl/8">
                  <CalendarCheck2Icon className="pointer-events-none size-7" /> Date picker
                </h2>
                <p className="text-foreground/60 text-sm/7">
                  Select dates effortlessly with a clean, intuitive interface. Designed for quick scheduling and seamless planning.
                </p>
              </div>
            </div>
            <div className="relative mt-auto overflow-hidden rounded-lg bg-black/[2.5%] bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed p-4 [--pattern-fg:var(--color-black)]/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-black/5 sm:p-8 dark:bg-white/[2.5%] dark:[--pattern-fg:var(--color-white)]/10 dark:after:inset-ring-white/10">
              <div className="relative flex w-full items-center gap-x-2 max-md:flex-col max-md:gap-y-5 md:justify-between">
                <span className="flex w-full justify-center">
                  <span className="flex h-auto max-h-[400px] w-[min(48vw,686px)] max-md:w-full">
                    <Image width={2595} height={1514} src="/website_datepicker_desktop.png" alt="" />
                  </span>
                </span>
                <div className="relative flex w-full items-center justify-between gap-x-2">
                  <span className="flex w-full justify-center">
                    <span className="flex h-auto max-h-[500px] w-full max-w-[244px]">
                      <Image width={740} height={1514} src="/website_datepicker_android.png" alt="" />
                    </span>
                  </span>
                  <span className="flex w-full justify-center">
                    <span className="flex h-auto max-h-[500px] w-full max-w-[244px]">
                      <Image width={740} height={1514} src="/mobile_datepicker_android.png" alt="" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-background @container isolate col-span-full flex flex-col gap-2 overflow-hidden rounded-2xl p-2 outline outline-black/5 md:col-span-1 dark:outline-white/10">
            <div className="flex w-full flex-col p-8 max-sm:p-4">
              <div className="flex w-full flex-col gap-y-2.5">
                <h2 className="flex items-center gap-x-4 text-xl/8 font-medium @md:text-2xl/8">
                  <PictureInPicture2Icon className="pointer-events-none size-7" /> Dropdown menu
                </h2>
                <p className="text-foreground/60 text-sm/7">
                  Organize choices in a clean, structured list that feels natural to use. With smooth navigation and quick selection, users find what
                  they need with ease.
                </p>
              </div>
            </div>
            <div className="relative mt-auto overflow-hidden rounded-lg bg-black/[2.5%] bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed p-4 [--pattern-fg:var(--color-black)]/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-black/5 sm:p-8 dark:bg-white/[2.5%] dark:[--pattern-fg:var(--color-white)]/10 dark:after:inset-ring-white/10">
              <div className="relative flex w-full items-center justify-between gap-x-2">
                <span className="flex w-full justify-center">
                  <span className="flex h-auto max-h-[500px] w-full max-w-[244px]">
                    <Image width={740} height={1514} src="/website_dropdownmenu_android.png" alt="" />
                  </span>
                </span>
                <span className="flex w-full justify-center">
                  <span className="flex h-auto max-h-[500px] w-full max-w-[244px]">
                    <Image width={740} height={1514} src="/mobile_dropdownmenu_android.png" alt="" />
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="bg-background @container isolate col-span-full flex flex-col gap-2 overflow-hidden rounded-2xl p-2 outline outline-black/5 md:col-span-1 dark:outline-white/10">
            <div className="flex w-full flex-col p-8 max-sm:p-4">
              <div className="flex w-full flex-col gap-y-2.5">
                <h2 className="flex items-center gap-x-4 text-xl/8 font-medium @md:text-2xl/8">
                  <LayoutDashboardIcon className="pointer-events-none size-7" /> Responsive layout
                </h2>
                <p className="text-foreground/60 text-sm/7">
                  Enjoy a seamless experience across devices with layouts that adapt beautifully. Designed to stay consistent on desktops, tablets,
                  and mobiles alike.
                </p>
              </div>
            </div>
            <div className="relative mt-auto h-full overflow-hidden rounded-lg bg-black/[2.5%] bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed p-4 [--pattern-fg:var(--color-black)]/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-black/5 sm:p-8 dark:bg-white/[2.5%] dark:[--pattern-fg:var(--color-white)]/10 dark:after:inset-ring-white/10">
              <div className="relative flex h-full w-full items-center justify-center">
                <span className="flex w-full justify-center">
                  <span className="flex h-auto max-h-[500px] w-full max-w-[683px]">
                    <Image width={2068} height={1514} src="/website_desktop_android.png" alt="" />
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="bg-background @container isolate col-span-full flex flex-col gap-2 overflow-hidden rounded-2xl p-2 outline outline-black/5 dark:outline-white/10">
            <div className="flex w-full flex-col p-8 max-sm:p-4">
              <div className="flex w-full flex-col gap-y-2.5">
                <h2 className="flex items-center gap-x-4 text-xl/8 font-medium @md:text-2xl/8">
                  <MessageSquareDotIcon className="pointer-events-none size-7" /> Toast
                </h2>
                <p className="text-foreground/60 text-sm/7">
                  Get instant feedback with lightweight, elegant notifications. Subtle yet powerful, always keeping users informed.
                </p>
              </div>
            </div>
            <div className="relative mt-auto overflow-hidden rounded-lg bg-black/[2.5%] bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed p-4 [--pattern-fg:var(--color-black)]/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-black/5 sm:p-8 dark:bg-white/[2.5%] dark:[--pattern-fg:var(--color-white)]/10 dark:after:inset-ring-white/10">
              <div className="relative flex w-full items-center gap-x-2 max-md:flex-col max-md:gap-y-5 md:justify-between">
                <span className="flex w-full justify-center">
                  <span className="flex h-auto max-h-[400px] w-[min(48vw,686px)] max-md:w-full">
                    <Image width={2595} height={1514} src="/website_toast_desktop.png" alt="" />
                  </span>
                </span>
                <div className="relative flex w-full items-center justify-between gap-x-2">
                  <span className="flex w-full justify-center">
                    <span className="flex h-auto max-h-[500px] w-full max-w-[244px]">
                      <Image width={740} height={1514} src="/website_toast_android.png" alt="" />
                    </span>
                  </span>
                  <span className="flex w-full justify-center">
                    <span className="flex h-auto max-h-[500px] w-full max-w-[244px]">
                      <Image width={740} height={1514} src="/mobile_toast_android.png" alt="" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LineContainer>
    </section>
  );
}
