"use client";

import { LazyMotion, domMax } from "motion/react";

export default function MotionLazy({ children }: React.PropsWithChildren) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
