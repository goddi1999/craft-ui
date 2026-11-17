import type { ComponentPropsWithRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const imagePinVariants = cva(
  "relative rounded-full border-2 border-white transition-colors duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
  {
    variants: {
      variant: {
        // Neutral by default: visible in light and dark mode.
        default: "bg-neutral-600 dark:bg-neutral-300",
        correct: "bg-blue-400",
        wrong: "bg-red-400",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const pingVariants = cva(
  "absolute inset-0 animate-ping rounded-full opacity-75",
  {
    variants: {
      variant: {
        default: "bg-neutral-600 dark:bg-neutral-300",
        correct: "bg-blue-400",
        wrong: "bg-red-400",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type ImagePinProps = ComponentPropsWithRef<"div"> &
  VariantProps<typeof imagePinVariants> & {
    /** Diameter in px. */
    size?: number;
    /** Pulse and ping. Off while a scan wipes the colour across the dot. */
    pulse?: boolean;
  };

/** The pulsing pin dot a learner drops on the image. */
export function ImagePin({
  className,
  variant,
  size = 24,
  pulse = true,
  style,
  ref,
  ...props
}: ImagePinProps) {
  return (
    <div
      ref={ref}
      data-slot="image-pin"
      className={cn(imagePinVariants({ variant }), pulse && "animate-pulse", className)}
      style={{ ...style, width: size, height: size }}
      {...props}
    >
      {pulse ? <span aria-hidden className={pingVariants({ variant })} /> : null}
    </div>
  );
}
