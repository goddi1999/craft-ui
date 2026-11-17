import { CHOICE_COUNT, QUIZ_PERSON_LABELS } from "./conjugation-quiz.constants";
import type {
  ConjugationQuizQuestion,
  QuizLanguage,
  QuizVerb,
} from "./conjugation-quiz.types";

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Four options: the answer plus three other forms of the same verb, shuffled. */
export function choicesFor(question: ConjugationQuizQuestion): string[] {
  const others = Array.from(
    new Set(question.distractors.filter((form) => form !== question.answer)),
  );
  return shuffle([
    question.answer,
    ...shuffle(others).slice(0, CHOICE_COUNT - 1),
  ]);
}

/** Spreads questions so the same verb rarely comes twice in a row. */
export function interleaveByVerb(
  questions: ConjugationQuizQuestion[],
): ConjugationQuizQuestion[] {
  const groups = new Map<string, ConjugationQuizQuestion[]>();
  for (const question of shuffle(questions)) {
    const group = groups.get(question.infinitive) ?? [];
    group.push(question);
    groups.set(question.infinitive, group);
  }
  const result: ConjugationQuizQuestion[] = [];
  let lastVerb: string | null = null;
  while (result.length < questions.length) {
    const candidates = [...groups.entries()]
      .filter(([, group]) => group.length > 0)
      .sort((a, b) => b[1].length - a[1].length);
    const pick =
      candidates.find(([verb]) => verb !== lastVerb) ?? candidates[0];
    result.push(pick[1].shift()!);
    lastVerb = pick[0];
  }
  return result;
}

/** One question per form of each verb, interleaved. */
export function buildQuizQuestions(
  verbs: QuizVerb[],
  language: QuizLanguage = "es",
): ConjugationQuizQuestion[] {
  const questions = verbs.flatMap((verb) =>
    verb.forms.map((form) => ({
      id: `${verb.infinitive}-${form.person}`,
      infinitive: verb.infinitive,
      prompt: QUIZ_PERSON_LABELS[language][form.person],
      answer: form.form,
      distractors: verb.forms.map((other) => other.form),
    })),
  );
  return interleaveByVerb(questions);
}
