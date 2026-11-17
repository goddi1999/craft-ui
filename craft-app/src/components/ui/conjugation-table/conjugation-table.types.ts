/** Grammatical person slot: 1 = I … 6 = they. */
export type ConjugationPerson = 1 | 2 | 3 | 4 | 5 | 6;

export type ConjugationLanguage = "de" | "es" | "fr" | "pt";

export type ConjugationForm = {
  person: ConjugationPerson;
  form: string;
};

export type ConjugationVerb = {
  id: string;
  infinitive: string;
  /** Shown as the card title; falls back to the infinitive. */
  translation?: string;
  forms: ConjugationForm[];
};

export type WheelPickerProps = {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  "aria-label": string;
  className?: string;
};

export type ConjugationCardProps = {
  verb: ConjugationVerb;
  language?: ConjugationLanguage;
  /** Called when a speaker button is tapped; defaults to the device's speech synthesis. */
  onSpeak?: (form: string) => void;
  onEdit?: (verb: ConjugationVerb) => void;
  onRemove?: (verb: ConjugationVerb) => void;
  className?: string;
};

export type ConjugationTableProps = Omit<ConjugationCardProps, "verb"> & {
  verbs: ConjugationVerb[];
  /** Id of the verb on the wheel; uncontrolled when omitted. */
  value?: string;
  /** Starting verb id when uncontrolled; defaults to the first verb. */
  defaultValue?: string;
  onValueChange?: (verbId: string) => void;
  title?: string;
  className?: string;
};
