import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { CornerArcs, ImagePinEmptyArt } from "./image-pin-empty-art";
import {
  imagePinPlaceholderVariants,
  type ImagePinPlaceholderBorder,
} from "./image-pin-empty.variants";

export type ImagePinPlaceholderProps = Omit<
  ComponentProps<"div">,
  "children"
> & {
  /** @default 'Nothing here yet' */
  label?: string;
  hint?: string;
  /** Show the filled block inside the picture icon. @default true */
  showInnerRect?: boolean;
  /** Outline: four rounded corner arcs, a full border, or none. @default 'corners' */
  border?: ImagePinPlaceholderBorder;
};

/**
 * A static empty state: an empty-picture icon over faint guide lines and a line
 * of text, outlined by corner arcs or a border. Use it where there is nothing to show yet.
 */
export function ImagePinPlaceholder({
  label = "Nothing here yet",
  hint,
  showInnerRect = true,
  border = "corners",
  className,
  ...props
}: ImagePinPlaceholderProps) {
  return (
    <div
      data-slot="image-pin-placeholder"
      data-border={border}
      className={cn(imagePinPlaceholderVariants({ border }), className)}
      {...props}
    >
      {border === "corners" ? <CornerArcs /> : null}
      <ImagePinEmptyArt
        label={label}
        hint={hint}
        showInnerRect={showInnerRect}
      />
    </div>
  );
}
