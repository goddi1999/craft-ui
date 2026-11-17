import type { ComponentPropsWithRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const imagePinVariants = cva(
  "relative rounded-full border-2 border-white animate-pulse",
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
  };

/** The pulsing pin dot a learner drops on the image. */
export function ImagePin({
  className,
  variant,
  size = 24,
  style,
  ref,
  ...props
}: ImagePinProps) {
  return (
    <div
      ref={ref}
      data-slot="image-pin"
      className={cn(imagePinVariants({ variant }), className)}
      style={{ ...style, width: size, height: size }}
      {...props}
    >
      <span aria-hidden className={pingVariants({ variant })} />
    </div>
  );
}
