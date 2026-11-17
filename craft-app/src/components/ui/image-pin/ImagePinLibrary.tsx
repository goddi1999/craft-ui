import { useState } from "react";
import { ImagePlus, Maximize2 } from "lucide-react";

import { BlurredScrollArea } from "@/components/ui/blurred-scroll-area";
import { Button } from "@/components/ui/button";
import {
  createLightboxHandle,
  Lightbox,
  LightboxCaption,
  LightboxClose,
  LightboxContent,
  LightboxCounter,
  LightboxFooter,
  LightboxHeader,
  LightboxItem,
  LightboxMedia,
  LightboxNext,
  LightboxPrevious,
  LightboxSlide,
  LightboxSlides,
  LightboxTrigger,
  LightboxZoom,
} from "@/components/ui/lightbox";
import { cn } from "@/lib/utils";

import type { ImagePinLibraryImage } from "./image-pin.types";

export type ImagePinLibraryProps = {
  images: readonly ImagePinLibraryImage[];
  /** `src` of the image on the board, outlined in the strip. */
  value?: string;
  /** A thumbnail click, or the preview's Insert button; the lightbox closes after it. */
  onInsert: (image: ImagePinLibraryImage) => void;
  className?: string;
};

/**
 * A short strip of images to put on the board. Click a thumbnail to insert it at
 * once; the round expand button at its top right opens a full preview
 * (swipe, zoom) that has its own Insert button.
 */
export function ImagePinLibrary({
  images,
  value,
  onInsert,
  className,
}: ImagePinLibraryProps) {
  const [index, setIndex] = useState(0);
  const [preview] = useState(createLightboxHandle);
  const previewed = images[index];

  return (
    <section
      data-slot="image-pin-library"
      aria-label="Image library"
      className={cn("flex flex-col gap-2", className)}
    >
      <Lightbox index={index} onIndexChange={setIndex} handle={preview}>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Library · {images.length}
          </p>
          <BlurredScrollArea
            orientation="horizontal"
            hideScrollBar
            shadowSize={24}
            className="w-full"
          >
            <ul className="flex w-max gap-2 p-1">
              {images.map((image, imageIndex) => (
                <li key={image.id} className="relative">
                  <LightboxTrigger
                    index={imageIndex}
                    aria-haspopup={undefined}
                    aria-label={`Insert ${image.caption ?? image.alt}`}
                    onClick={(event) => {
                      event.preventDefault();
                      onInsert(image);
                    }}
                    className={cn(
                      "block h-24 w-36 cursor-pointer overflow-hidden rounded-lg transition-transform duration-150 ease-out active:scale-[0.97]",
                      image.src === value &&
                        "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    )}
                  >
                    {({ imageRef }) => (
                      <img
                        ref={imageRef}
                        src={image.thumbnail ?? image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        draggable={false}
                        className="size-full rounded-[inherit] object-cover outline -outline-offset-1 outline-foreground/10"
                      />
                    )}
                  </LightboxTrigger>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    aria-label={`Preview ${image.caption ?? image.alt}`}
                    onClick={() => preview.open(imageIndex)}
                    className="absolute top-1.5 right-1.5 rounded-full bg-background/80 shadow-sm backdrop-blur-md transition-transform duration-150 ease-out before:absolute before:-inset-2 active:scale-[0.94]"
                  >
                    <Maximize2 />
                  </Button>
                </li>
              ))}
            </ul>
          </BlurredScrollArea>
        </div>

        <LightboxContent aria-label="Image library preview">
          <LightboxSlides aria-label="Images" aria-roledescription="carousel">
            {images.map((image, imageIndex) => (
              <LightboxSlide key={image.id}>
                <LightboxItem
                  index={imageIndex}
                  caption={image.caption ?? image.alt}
                  aria-roledescription="slide"
                  aria-label={`${imageIndex + 1} of ${images.length}`}
                >
                  <LightboxZoom>
                    <LightboxMedia width={image.width} height={image.height}>
                      <img
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        draggable={false}
                      />
                    </LightboxMedia>
                  </LightboxZoom>
                </LightboxItem>
              </LightboxSlide>
            ))}
          </LightboxSlides>

          <LightboxHeader>
            {previewed ? (
              <LightboxClose
                variant="default"
                size="default"
                onClick={() => onInsert(previewed)}
              >
                <ImagePlus />
                Insert
              </LightboxClose>
            ) : null}
            <LightboxClose />
          </LightboxHeader>
          <LightboxPrevious />
          <LightboxNext />
          <LightboxFooter>
            <div className="flex flex-col items-center gap-0.5">
              <LightboxCaption />
              <LightboxCounter>
                {({ current, total }) => `${current} of ${total}`}
              </LightboxCounter>
            </div>
          </LightboxFooter>
        </LightboxContent>
      </Lightbox>
    </section>
  );
}
