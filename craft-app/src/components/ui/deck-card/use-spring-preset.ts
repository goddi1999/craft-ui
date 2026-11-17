import { useReducedMotion } from "motion/react";

/** Works both as a `transition` prop and as options for `animate(motionValue, …)`. */
export type SpringTransition = {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
};

/**
 * Turns a "stiffness damping" pair (mass 1) into a Motion spring. With reduced motion
 * the damping goes critical, so values still land on target but never overshoot.
 */
export function useSpringPreset() {
  const reduce = useReducedMotion();
  return function spring(stiffness: number, damping: number): SpringTransition {
    return {
      type: "spring",
      stiffness,
      damping: reduce ? 2 * Math.sqrt(stiffness) : damping,
      mass: 1,
    };
  };
}
