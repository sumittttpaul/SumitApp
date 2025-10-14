"use client";

import DropDownMenu from "@/components/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import useStateX from "@/hooks/use-state-x";

export default function ExampleDatePicker({ value, onChange }: { value?: Date; onChange?: (e?: Date) => void }) {
  const [open, setOpen] = useStateX(false);

  return (
    <DropDownMenu
      open={open.peek}
      setOpen={setOpen}
      placement="bottom"
      mode="with-bottom-sheet"
      tooltip="Example date picker"
      items={[
        {
          content: (
            <Calendar
              key="1"
              mode="single"
              selected={value}
              captionLayout="dropdown"
              onSelect={(date) => {
                onChange?.(date);
                setOpen(false);
              }}
            />
          ),
        },
      ]}
    >
      <button
        type="button"
        className="hover:bg-input border-input flex rounded-full border px-5 py-1 text-sm/7 hover:border-transparent active:scale-90"
      >
        Date picker
      </button>
    </DropDownMenu>
  );
}
