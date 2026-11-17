import { PERSON_LABELS, VOICE_LANG } from "./conjugation-table.constants";
import type {
  ConjugationLanguage,
  ConjugationPerson,
} from "./conjugation-table.types";

export function personLabel(
  language: ConjugationLanguage,
  person: ConjugationPerson,
): string {
  return PERSON_LABELS[language][person];
}

/** Reads one conjugated form aloud with the device's own voice (no server, nothing cached). */
export function speakForm(text: string, language: ConjugationLanguage): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = VOICE_LANG[language];
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
