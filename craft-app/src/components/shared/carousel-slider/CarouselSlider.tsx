"use client";

import { useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
  type Variants,
} from "motion/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselSliderProps {
  slides: ReactNode[];
  index?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
}

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    filter: "brightness(2)",
    scale: 0.75,
    opacity: 0,
    rotate: direction > 0 ? 30 : -30,
  }),
  center: {
    x: 0,
    filter: "brightness(1)",
    scale: 1,
    opacity: 1,
    rotate: -3,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    filter: "brightness(2)",
    scale: 0.75,
    opacity: 0,
    rotate: direction > 0 ? -30 : 30,
    zIndex: 0,
  }),
};

export function CarouselSlider({
  slides,
  index: indexProp,
  onIndexChange,
  className,
}: CarouselSliderProps) {
  const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const isControlled = indexProp != null;
  const index = isControlled ? indexProp : uncontrolledIndex;

  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-200, 200], [-18, 18]);

  const paginate = (newDirection: number) => {
    if (slides.length === 0) return;
    setDirection(newDirection);
    const next =
      (index + newDirection + slides.length) % slides.length;
    if (!isControlled) setUncontrolledIndex(next);
    onIndexChange?.(next);
  };

  const goTo = (next: number) => {
    if (next === index) return;
    setDirection(next > index ? 1 : -1);
    if (!isControlled) setUncontrolledIndex(next);
    onIndexChange?.(next);
  };

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.x < -120) paginate(1);
    else if (info.offset.x > 120) paginate(-1);
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative flex aspect-[634/660] w-[min(86vw,380px)] items-center justify-center -rotate-[6deg]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", bounce: 0.2, duration: 0.5 },
              scale: { duration: 0.35 },
              opacity: { duration: 0.25 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ rotate, x: dragX }}
            onDragEnd={handleDragEnd}
            className="absolute h-full w-full overflow-hidden rounded-[40px] border-[1.2px] border-white/10 bg-background p-2 shadow-md"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-black">
              {slides[index]}

              <button
                type="button"
                title="Favourite"
                className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/70 shadow-md backdrop-blur-md"
              >
                <Heart
                  size={22}
                  strokeWidth={1.5}
                  className="text-[#FAFAFA]"
                />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute -z-10 h-[95%] w-[95%] scale-95 rounded-[40px] border-[6px] border-white/10 bg-background opacity-50" />
      </div>

      <div className="mt-8 flex gap-2.5 -rotate-[6deg] pl-8">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            type="button"
            aria-label={`Show year ${i + 1}`}
            animate={{
              scale: i === index ? 1.2 : 1,
              opacity: i === index ? 1 : 0.4,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className={cn(
              "size-2.5 cursor-pointer rounded-full",
              i === index ? "bg-primary" : "bg-[#FAFAFA]",
            )}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
