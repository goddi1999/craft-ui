/** Grammatical person slot: 1 = I … 6 = they. */
export type QuizPerson = 1 | 2 | 3 | 4 | 5 | 6;

export type QuizLanguage = "de" | "es" | "fr" | "pt";

export type QuizVerb = {
  infinitive: string;
  forms: { person: QuizPerson; form: string }[];
};

export type ConjugationQuizQuestion = {
  id: string;
  /** Small caps line above the prompt, e.g. "comer". */
  infinitive: string;
  /** The person to conjugate for, e.g. "él/ella/usted". */
  prompt: string;
  answer: string;
  /** Other forms of the same verb; three of them become the wrong choices. */
  distractors: string[];
};

export type QuizVerdict = "correct" | "wrong";

export type QuizStats = { right: number; wrong: number; total: number };

export type ConjugationQuizProps = {
  questions: ConjugationQuizQuestion[];
  /** Fires when a choice is picked, before Next. */
  onAnswer?: (
    question: ConjugationQuizQuestion,
    picked: string,
    verdict: QuizVerdict,
  ) => void;
  /** Shown after a correct answer; skips the question as "too easy". */
  onTooEasy?: (question: ConjugationQuizQuestion) => void;
  onComplete?: (stats: QuizStats) => void;
  /** Shows the Exit button; omit to hide it. */
  onExit?: () => void;
  /** Number keys 1–4 pick a choice, Enter goes on. */
  keyboard?: boolean;
  className?: string;
};
