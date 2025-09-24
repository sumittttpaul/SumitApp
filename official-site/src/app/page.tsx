import ModificationSection from "@/ui/modification-section";
import TechStackSection from "@/ui/techstack-section";
import ComponentSection from "@/ui/component-section";
import IntroSection from "@/ui/intro-section";

export default function Home() {
  return (
    <main className="mt-13 flex flex-col gap-24 py-24 text-black max-sm:gap-13 max-sm:py-10 dark:text-white">
      <IntroSection />
      <TechStackSection />
      <ComponentSection />
      <ModificationSection />
    </main>
  );
}
