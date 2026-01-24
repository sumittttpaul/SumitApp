"use client";

import Tooltip from "@/components/tooltip";
import useToast from "@/hooks/use-toast";

export default function ExampleToast() {
  const { showToast } = useToast();

  const handleClick = () => showToast("This is an example toast");

  return (
    <Tooltip text="Example toast">
      <button
        type="button"
        onClick={handleClick}
        className="hover:bg-input border-input flex rounded-full border px-5 py-1 text-sm/7 hover:border-transparent active:scale-90"
      >
        Toast
      </button>
    </Tooltip>
  );
}
