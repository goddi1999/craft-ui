import type { QuizLanguage, QuizPerson } from "./conjugation-quiz.types";

/** Subject pronouns per person slot, as shown in the prompt. */
export const QUIZ_PERSON_LABELS: Record<
  QuizLanguage,
  Record<QuizPerson, string>
> = {
  de: { 1: "ich", 2: "du", 3: "er/sie/es", 4: "wir", 5: "ihr", 6: "sie/Sie" },
  es: {
    1: "yo",
    2: "tú",
    3: "él/ella/usted",
    4: "nosotros",
    5: "vosotros",
    6: "ellos/ustedes",
  },
  fr: {
    1: "je",
    2: "tu",
    3: "il/elle/on",
    4: "nous",
    5: "vous",
    6: "ils/elles",
  },
  pt: {
    1: "eu",
    2: "tu",
    3: "ele/ela/você",
    4: "nós",
    5: "vós",
    6: "eles/vocês",
  },
};

export const CHOICE_COUNT = 4;

/*
 * Every motion value in one place, so the feel can be tuned without touching components.
 * Springs are stiffness/damping pairs (mass 1).
 */
export const QUIZ_MOTION = {
  /** Prompt text leaving up and the next one arriving from below. */
  promptSpring: { type: "spring", stiffness: 420, damping: 34 },
  promptOffset: 18,
  promptBlur: 6,
  /** Choices dropping in after each new prompt. */
  choiceSpring: { type: "spring", stiffness: 520, damping: 32 },
  choiceStagger: 0.045,
  choiceDelay: 0.08,
  choiceOffset: 10,
  /** The right answer pops, a wrong pick shakes. */
  correctPop: [1, 1.06, 1],
  correctPopDuration: 0.32,
  wrongShake: [0, -7, 7, -5, 5, -2, 0],
  wrongShakeDuration: 0.42,
  /** The prompt card's verdict glow. */
  glowDuration: 0.5,
  /** Counter digits rolling. */
  counterSpring: { type: "spring", stiffness: 500, damping: 36 },
  /** Feedback block opening under the choices. */
  feedbackSpring: { type: "spring", stiffness: 460, damping: 36 },
  /** Round-complete check and lines. */
  completeSpring: { type: "spring", stiffness: 360, damping: 22 },
  completeStagger: 0.07,
} as const;

export const PRIMARY_PILL_CLASS_NAME =
  "flex h-[52px] w-full flex-none cursor-pointer touch-manipulation select-none items-center justify-center gap-2 rounded-full bg-foreground text-[15px] font-semibold text-background transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-4";

export const QUIET_BUTTON_CLASS_NAME =
  "mx-auto flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted-foreground transition-[color,transform] hover:text-foreground active:scale-95";
