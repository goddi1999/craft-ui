import type {
  ConjugationLanguage,
  ConjugationPerson,
} from "./conjugation-table.types";

/** Subject pronouns per person slot, as shown in tables and prompts. */
export const PERSON_LABELS: Record<
  ConjugationLanguage,
  Record<ConjugationPerson, string>
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

/** BCP 47 voice language per learnable language. */
export const VOICE_LANG: Record<ConjugationLanguage, string> = {
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  pt: "pt-PT",
};

/** Wheel row height in px. Fixed so the centered option is plain arithmetic on scrollTop. */
export const WHEEL_ITEM_HEIGHT = 44;
export const WHEEL_VISIBLE_ITEMS = 5;
/** Fallback for browsers without `scrollend`: commit once scrolling has been quiet this long. */
export const WHEEL_SETTLE_DELAY_MS = 120;
