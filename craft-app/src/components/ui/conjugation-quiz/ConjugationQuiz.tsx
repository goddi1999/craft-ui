import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

import type { ConjugationQuizProps } from "./conjugation-quiz.types";
import {
  QuizChoices,
  QuizCounter,
  QuizExit,
  QuizFeedbackPanel,
  QuizPromptCard,
  QuizRoundComplete,
} from "./conjugation-quiz-parts";
import { useConjugationQuiz } from "./use-conjugation-quiz";

/**
 * Conjugation multiple choice: given an infinitive and a person, pick the right form out
 * of four. The prompt slides and blurs between questions, choices drop in one by one,
 * the right answer pops and a wrong pick shakes; the round ends on a drawn check.
 */
export function ConjugationQuiz({
  questions,
  onAnswer,
  onTooEasy,
  onComplete,
  onExit,
  keyboard = true,
  className,
}: ConjugationQuizProps) {
  const quiz = useConjugationQuiz(questions);
  const { current, choices, feedback, finished, stats, index, round } = quiz;
  const completedRound = useRef<number | null>(null);

  function pick(choice: string) {
    if (!current) return;
    const verdict = quiz.answer(choice);
    if (verdict) onAnswer?.(current, choice, verdict);
  }

  useEffect(() => {
    if (!finished || completedRound.current === round) return;
    completedRound.current = round;
    onComplete?.(stats);
  }, [finished, round, stats, onComplete]);

  // 1–4 pick a choice; Enter goes on (unless a button already has focus and handles it).
  const pickRef = useRef(pick);
  useEffect(() => {
    pickRef.current = pick;
  });
  useEffect(() => {
    if (!keyboard || finished) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable="true"]')) return;
      if (!feedback) {
        const slot = Number(event.key) - 1;
        if (slot >= 0 && slot < choices.length) {
          event.preventDefault();
          pickRef.current(choices[slot]);
        }
        return;
      }
      if (event.key === "Enter" && !target?.closest("button")) {
        event.preventDefault();
        quiz.next();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keyboard, finished, feedback, choices, quiz]);

  if (questions.length === 0) return null;

  if (finished || !current) {
    return (
      <div className={className}>
        <QuizRoundComplete
          summary={`${stats.right} right · ${stats.wrong} to repeat · ${stats.total} forms`}
          onAgain={quiz.restart}
          onDone={onExit}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("mx-auto flex w-full max-w-md flex-col gap-6", className)}
    >
      <QuizCounter current={index + 1} total={questions.length} />
      <QuizPromptCard question={current} verdict={feedback?.verdict} />
      <QuizChoices
        question={current}
        choices={choices}
        feedback={feedback}
        onPick={pick}
      />
      <QuizFeedbackPanel
        question={current}
        feedback={feedback}
        onNext={() => quiz.next(current.id)}
        onTooEasy={
          onTooEasy
            ? () => {
                onTooEasy(current);
                quiz.next(current.id);
              }
            : undefined
        }
      />
      {onExit ? <QuizExit onClick={onExit} /> : null}
    </div>
  );
}
