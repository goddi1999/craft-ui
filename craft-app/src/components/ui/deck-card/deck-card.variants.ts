import { cva, type VariantProps } from "class-variance-authority";

/** The colored icon tile next to the deck name. */
export const deckIconBadgeVariants = cva(
  "flex size-9 shrink-0 items-center justify-center",
  {
    variants: {
      shape: {
        square: "rounded-xl",
        round: "rounded-full",
      },
    },
    defaultVariants: { shape: "square" },
  },
);

/** One color swatch in `DeckColorSwatches`. */
export const deckSwatchVariants = cva(
  "relative shrink-0 transition-transform",
  {
    variants: {
      shape: {
        square: "",
        round: "rounded-full",
      },
      size: {
        sm: "size-5",
        md: "size-9",
      },
    },
    compoundVariants: [
      { shape: "square", size: "sm", className: "rounded-md" },
      { shape: "square", size: "md", className: "rounded-xl" },
    ],
    defaultVariants: { shape: "square", size: "md" },
  },
);

export type DeckShape = NonNullable<
  VariantProps<typeof deckIconBadgeVariants>["shape"]
>;
