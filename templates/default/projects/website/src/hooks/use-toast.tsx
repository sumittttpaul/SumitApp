"use client";

import Toast from "@/components/toast";
import { toast } from "sonner";

export default function useToast() {
  const showToast = (title?: string) => toast.custom((t) => <Toast title={title} onExit={() => toast.dismiss(t)} />);
  return { showToast };
}
