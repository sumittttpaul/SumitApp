import { RiToolsLine, RiFolderCheckLine, RiCheckLine, RiCircleFill } from "@remixicon/react";
import CopyToClipboard from "@/components/copy-to-clipboard";
import FolderStructure from "@/components/folder-structure";
import LineContainer from "@/components/line-container";
import CodeEditor from "@/components/code-editor";

export default function ModificationSection() {
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
        <p className="top-0 -left-[var(--gutter-width)] origin-bottom-right text-left font-mono text-xs font-bold tracking-widest text-green-500 uppercase max-2xl:leading-6 sm:font-semibold 2xl:absolute 2xl:-translate-x-full 2xl:-translate-y-full 2xl:-rotate-90 2xl:text-right dark:text-green-400">
          Customization
        </p>
      </LineContainer>
      <LineContainer className="order-3 px-2 max-sm:px-4">
        <h1 className="text-2xl font-medium tracking-tighter text-balance sm:text-3xl lg:text-4xl">Add custom modifications to fit your needs.</h1>
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
          Although everything is pre-configured for you to get started quickly, you can still customize the project by editing a few files and
          tailoring it to your specific needs.
        </p>
      </LineContainer>
      <LineContainer className="order-6 mt-10 max-sm:mt-8">
        <div className="grid w-full grid-flow-dense grid-cols-2 gap-2 bg-black/5 p-2 dark:bg-white/10">
          <div className="bg-background @container isolate col-span-full flex gap-5 overflow-hidden rounded-2xl p-2 outline outline-black/5 max-lg:flex-col dark:outline-white/10">
            <div className="relative w-full overflow-hidden rounded-lg bg-black/[2.5%] bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed pt-8 pl-8 [--pattern-fg:var(--color-black)]/5 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:inset-ring after:inset-ring-black/5 max-sm:pt-4 max-sm:pl-4 dark:bg-white/[2.5%] dark:[--pattern-fg:var(--color-white)]/10 dark:after:inset-ring-white/10">
              <CodeEditor>
                <FolderStructure />
              </CodeEditor>
            </div>
            <div className="flex w-full flex-col gap-y-5 p-8 max-sm:p-4">
              <div className="flex w-full flex-col gap-y-2.5">
                <h2 className="flex items-center gap-x-4 text-xl/8 font-medium @md:text-2xl/8">
                  <RiToolsLine className="pointer-events-none size-7" /> Package manager
                </h2>
                <p className="text-foreground/60 text-sm/7">
                  By default, the project uses <b className="text-sky-400">Bun</b> as the package manager. You can switch to{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">npm</code>,{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">yarn</code>, or{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">pnpm</code> if preferred.
                </p>
                <h3 className="text-base">Steps:</h3>
                <p className="text-foreground/60 ml-2.5 text-sm/7">
                  <b>1.</b> Need to remove the following files and folders:{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">node_modules</code>,{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">dist</code>,{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">.turbo</code>,{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">.next</code>,{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">.expo</code>.
                </p>
                <p className="text-foreground/60 ml-2.5 text-sm/7">
                  <b>2.</b> Run the custom script to clean automatically:
                </p>
                <CopyToClipboard type="code">bun clean</CopyToClipboard>
                <p className="text-foreground/60 ml-2.5 text-sm/7">
                  <b>3.</b> Install dependencies with your preferred package manager:
                </p>
                <CopyToClipboard type="code">npm install</CopyToClipboard>
                <p className="text-foreground/60 ml-2.5 text-sm/7">or</p>
                <CopyToClipboard type="code">yarn install</CopyToClipboard>
              </div>
              <p className="border-input text-foreground/60 border-l-4 pl-5 text-sm/7">
                <b className="text-yellow-600 dark:text-yellow-400">💡 Tip:</b> Switching package managers is seamless. Just make sure to re-install
                dependencies after cleaning.
              </p>
            </div>
          </div>
          <div className="bg-background @container isolate col-span-full flex flex-col gap-2 overflow-hidden rounded-2xl p-2 outline outline-black/5 md:col-span-1 dark:outline-white/10">
            <div className="flex w-full flex-col gap-y-5 p-8 max-sm:p-4">
              <div className="flex w-full flex-col gap-y-2.5">
                <h2 className="flex items-center gap-x-4 text-xl/8 font-medium @md:text-2xl/8">
                  <RiFolderCheckLine className="pointer-events-none size-7" /> Packages
                </h2>
                <p className="text-foreground/60 text-sm/7">
                  The monorepo comes with global packages that are shared across all projects:{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">@packages/components</code>,{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">@packages/hooks</code>,{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">@packages/types</code>,{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">@packages/utils</code>,{" "}
                  <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">@packages/validations</code>.
                </p>
                <p className="text-foreground/60 text-sm/7">These allow you to write reusable code once and use it across platforms.</p>
                <h3 className="text-base">Customization:</h3>
                <p className="text-foreground/60 flex items-start gap-x-2.5 text-sm/7">
                  <RiCheckLine className="pointer-events-none mt-1 size-5 min-w-5 text-green-600 dark:text-green-300" />
                  <span>
                    You can <b className="text-foreground">add</b> new packages as needed.
                  </span>
                </p>
                <p className="text-foreground/60 flex items-start gap-x-2.5 text-sm/7">
                  <RiCheckLine className="pointer-events-none mt-1 size-5 min-w-5 text-green-600 dark:text-green-300" />
                  <span>
                    You can <b className="text-foreground">remove</b> existing packages if not required.
                  </span>
                </p>
              </div>
              <p className="border-input text-foreground/60 border-l-4 pl-5 text-sm/7">
                <b className="text-yellow-600 dark:text-yellow-400">⚠️ Important:</b> Do not remove{" "}
                <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">eslint-config</code> and{" "}
                <code className="bg-input text-foreground rounded-md px-1.5 py-1 font-mono">typescript-config</code>. They are essential for
                maintaining consistency across all projects.
              </p>
            </div>
          </div>
          <div className="bg-background @container isolate col-span-full flex flex-col gap-2 overflow-hidden rounded-2xl p-2 outline outline-black/5 md:col-span-1 dark:outline-white/10">
            <div className="flex w-full flex-col gap-y-5 p-8 max-sm:p-4">
              <div className="flex w-full flex-col gap-y-2.5">
                <h2 className="flex items-center gap-x-4 text-xl/8 font-medium @md:text-2xl/8">
                  <RiFolderCheckLine className="pointer-events-none size-7" /> Projects
                </h2>
                <p className="text-foreground/60 text-sm/7">By default, the setup includes three projects:</p>
                <p className="text-foreground/60 flex items-start gap-x-2.5 text-sm/7">
                  <RiCircleFill className="pointer-events-none mt-2.5 mr-2.5 size-2 min-w-2 text-sky-600 dark:text-sky-400" />
                  <span>
                    <b className="text-foreground">Backend</b> → Node.js app (optimized for Vercel serverless functions)
                  </span>
                </p>
                <p className="text-foreground/60 flex items-start gap-x-2.5 text-sm/7">
                  <RiCircleFill className="pointer-events-none mt-2.5 mr-2.5 size-2 min-w-2 text-sky-600 dark:text-sky-400" />
                  <span>
                    <b className="text-foreground">Mobile</b> → Expo app (Android + iOS only, no web support)
                  </span>
                </p>
                <p className="text-foreground/60 flex items-start gap-x-2.5 text-sm/7">
                  <RiCircleFill className="pointer-events-none mt-2.5 mr-2.5 size-2 min-w-2 text-sky-600 dark:text-sky-400" />
                  <span>
                    <b className="text-foreground">Website</b> → Next.js web application
                  </span>
                </p>
                <h3 className="text-base">Customization:</h3>
                <p className="text-foreground/60 flex items-start gap-x-2.5 text-sm/7">
                  <RiCheckLine className="pointer-events-none mt-1 size-5 min-w-5 text-green-600 dark:text-green-300" />
                  <span>
                    You can <b className="text-foreground">add</b> new projects to extend your monorepo.
                  </span>
                </p>
                <p className="text-foreground/60 flex items-start gap-x-2.5 text-sm/7">
                  <RiCheckLine className="pointer-events-none mt-1 size-5 min-w-5 text-green-600 dark:text-green-300" />
                  <span>
                    You can <b className="text-foreground">remove</b> existing projects if they&apos;re not required.
                  </span>
                </p>
              </div>
              <p className="border-input text-foreground/60 border-l-4 pl-5 text-sm/7">
                <b className="text-yellow-600 dark:text-yellow-400">💡 Tip:</b> Keep your monorepo lean by including only the projects you actually
                use.
              </p>
            </div>
          </div>
        </div>
      </LineContainer>
    </section>
  );
}
