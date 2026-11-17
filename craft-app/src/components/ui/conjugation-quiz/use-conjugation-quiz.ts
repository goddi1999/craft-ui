import { useCallback, useMemo, useState } from "react";

import type {
  ConjugationQuizQuestion,
  QuizStats,
  QuizVerdict,
} from "./conjugation-quiz.types";
import { choicesFor } from "./conjugation-quiz.utils";

export type QuizFeedback = { verdict: QuizVerdict; picked: string };

/** Round state: which question, what was picked, the running score. */
export function useConjugationQuiz(questions: ConjugationQuizQuestion[]) {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
  const [stats, setStats] = useState<QuizStats>({
    right: 0,
    wrong: 0,
    total: questions.length,
  });
  // A new round number reshuffles every question's choices.
  const [round, setRound] = useState(0);

  const current = questions[index] ?? null;
  const finished = questions.length > 0 && index >= questions.length;
  const choices = useMemo(
    () => (current ? choicesFor(current) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, round],
  );

  const answer = useCallback(
    (picked: string): QuizVerdict | null => {
      if (!current || feedback) return null;
      const verdict: QuizVerdict =
        picked === current.answer ? "correct" : "wrong";
      setFeedback({ verdict, picked });
      setStats((s) => ({
        ...s,
        right: s.right + (verdict === "correct" ? 1 : 0),
        wrong: s.wrong + (verdict === "wrong" ? 1 : 0),
      }));
      return verdict;
    },
    [current, feedback],
  );

  /** Moves on from `questionId` only; a stale Next (e.g. one still animating out) is ignored. */
  const next = useCallback(
    (questionId?: string) => {
      if (questionId !== undefined && questionId !== current?.id) return;
      if (!feedback) return;
      setFeedback(null);
      setIndex((i) => i + 1);
    },
    [current, feedback],
  );

  const restart = useCallback(() => {
    setFeedback(null);
    setIndex(0);
    setStats({ right: 0, wrong: 0, total: questions.length });
    setRound((r) => r + 1);
  }, [questions.length]);

  return {
    index,
    round,
    current,
    choices,
    feedback,
    stats,
    finished,
    answer,
    next,
    restart,
  };
}
