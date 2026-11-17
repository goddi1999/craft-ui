import { Check, RotateCcw, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

import {
  PRIMARY_PILL_CLASS_NAME,
  QUIET_BUTTON_CLASS_NAME,
  QUIZ_MOTION as M,
} from "./conjugation-quiz.constants";
import type {
  ConjugationQuizQuestion,
  QuizVerdict,
} from "./conjugation-quiz.types";
import type { QuizFeedback } from "./use-conjugation-quiz";

/** "3 / 12": the current number rolls up as the round moves on. */
export function QuizCounter({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const reduce = useReducedMotion();
  if (total <= 0) return null;
  return (
    <p
      className="flex items-center justify-center gap-1 text-sm text-muted-foreground tabular-nums"
      aria-label={`${current} of ${total}`}
    >
      <span className="relative inline-flex h-5 items-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={current}
            initial={reduce ? { opacity: 0 } : { y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
            transition={M.counterSpring}
          >
            {current}
          </motion.span>
        </AnimatePresence>
      </span>
      <span aria-hidden>/</span>
      <span>{total}</span>
    </p>
  );
}

/** The infinitive and the person; swaps with a blur slide and glows with the verdict. */
export function QuizPromptCard({
  question,
  verdict,
}: {
  question: ConjugationQuizQuestion;
  verdict?: QuizVerdict;
}) {
  const reduce = useReducedMotion();
  const offset = reduce ? 0 : M.promptOffset;
  const blur = reduce ? 0 : M.promptBlur;

  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-muted/60">
      <motion.span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10",
          verdict === "wrong" ? "bg-destructive" : "bg-emerald-500",
        )}
        initial={false}
        animate={{ opacity: verdict ? [0, 0.22, 0.1] : 0 }}
        transition={{
          duration: verdict ? M.glowDuration : 0.2,
          ease: "easeOut",
        }}
      />
      <div className="grid min-h-[168px] place-items-center px-5 py-10 text-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={question.id}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: offset, filter: `blur(${blur}px)` }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -offset, filter: `blur(${blur}px)` }}
            transition={M.promptSpring}
          >
            <span className="text-xs tracking-wide text-muted-foreground uppercase">
              {question.infinitive}
            </span>
            <span className="text-3xl font-semibold">{question.prompt} …</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

type ChoiceButtonProps = {
  choice: string;
  order: number;
  shortcut?: number;
  feedback: QuizFeedback | null;
  isAnswer: boolean;
  onPick: (choice: string) => void;
};

function ChoiceButton({
  choice,
  order,
  shortcut,
  feedback,
  isAnswer,
  onPick,
}: ChoiceButtonProps) {
  const reduce = useReducedMotion();
  const isPicked = feedback?.picked === choice;
  const showRight = Boolean(feedback) && isAnswer;
  const showWrong = Boolean(feedback) && isPicked && !isAnswer;

  return (
    <motion.button
      type="button"
      disabled={Boolean(feedback)}
      onClick={() => onPick(choice)}
      aria-keyshortcuts={shortcut ? String(shortcut) : undefined}
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, y: M.choiceOffset, scale: 0.96 }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: showRight && !reduce ? [...M.correctPop] : 1,
        x: showWrong && !reduce ? [...M.wrongShake] : 0,
      }}
      transition={{
        default: {
          ...M.choiceSpring,
          delay: M.choiceDelay + order * M.choiceStagger,
        },
        scale: showRight
          ? { duration: M.correctPopDuration, ease: "easeOut" }
          : {
              ...M.choiceSpring,
              delay: M.choiceDelay + order * M.choiceStagger,
            },
        x: { duration: M.wrongShakeDuration, ease: "easeInOut" },
      }}
      whileTap={feedback || reduce ? undefined : { scale: 0.97 }}
      className={cn(
        "relative min-h-[56px] rounded-2xl px-3 text-base font-medium transition-colors duration-200",
        !feedback && "bg-muted text-foreground hover:bg-muted/80",
        showRight && "bg-emerald-600 text-white",
        showWrong && "bg-destructive text-white",
        feedback &&
          !isAnswer &&
          !isPicked &&
          "bg-muted text-muted-foreground opacity-60",
      )}
    >
      {choice}
      <AnimatePresence>
        {showRight || showWrong ? (
          <motion.span
            key="mark"
            aria-hidden
            className="absolute top-1/2 right-3 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.4, rotate: reduce ? 0 : -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={M.completeSpring}
          >
            {showRight ? (
              <Check className="size-4" />
            ) : (
              <X className="size-4" />
            )}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}

/** 2×2 options; they drop in one by one for each new question. */
export function QuizChoices({
  question,
  choices,
  feedback,
  onPick,
}: {
  question: ConjugationQuizQuestion;
  choices: string[];
  feedback: QuizFeedback | null;
  onPick: (choice: string) => void;
}) {
  return (
    <div role="group" aria-label="Choices" className="grid grid-cols-2 gap-3">
      {choices.map((choice, order) => (
        <ChoiceButton
          key={`${question.id}-${choice}`}
          choice={choice}
          order={order}
          shortcut={order + 1}
          feedback={feedback}
          isAnswer={choice === question.answer}
          onPick={onPick}
        />
      ))}
    </div>
  );
}

/** Verdict line, Next and the optional "Too easy"; opens under the choices. */
export function QuizFeedbackPanel({
  question,
  feedback,
  onNext,
  onTooEasy,
}: {
  question: ConjugationQuizQuestion;
  feedback: QuizFeedback | null;
  onNext: () => void;
  onTooEasy?: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {feedback ? (
        <motion.div
          key={question.id}
          className="overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0, pointerEvents: "none" }}
          transition={M.feedbackSpring}
        >
          <motion.div
            className="flex flex-col gap-3 pt-0.5"
            initial={reduce ? false : { y: -8 }}
            animate={{ y: 0 }}
            transition={M.feedbackSpring}
          >
            <p
              role="status"
              className={cn(
                "text-center text-sm",
                feedback.verdict === "wrong"
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {feedback.verdict === "correct" ? (
                "Correct"
              ) : (
                <>
                  The answer is <strong>{question.answer}</strong>
                </>
              )}
            </p>
            <button
              type="button"
              autoFocus
              onClick={onNext}
              className={PRIMARY_PILL_CLASS_NAME}
            >
              Next
            </button>
            {feedback.verdict === "correct" && onTooEasy ? (
              <button
                type="button"
                onClick={onTooEasy}
                className="h-11 text-sm font-medium text-muted-foreground"
              >
                Too easy
              </button>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function QuizExit({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={QUIET_BUTTON_CLASS_NAME}>
      <X className="size-4" aria-hidden />
      Exit
    </button>
  );
}

/** End of the round: the check draws itself, then the result and the actions rise in. */
export function QuizRoundComplete({
  summary,
  onAgain,
  onDone,
}: {
  summary: string;
  onAgain: () => void;
  onDone?: () => void;
}) {
  const reduce = useReducedMotion();
  const rise = (step: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { ...M.completeSpring, delay: 0.25 + step * M.completeStagger },
  });

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-2 pt-10 text-center">
      <motion.span
        className="grid size-14 place-items-center rounded-full bg-muted"
        initial={reduce ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={M.completeSpring}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
          />
          <motion.path
            d="m9 12 2 2 4-4"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.4 }}
          />
        </svg>
      </motion.span>
      <motion.h2 className="mt-2 text-xl font-semibold" {...rise(0)}>
        Round complete
      </motion.h2>
      <motion.p className="text-sm text-muted-foreground" {...rise(1)}>
        {summary}
      </motion.p>

      <motion.div className="mt-6 flex w-full flex-col gap-1" {...rise(2)}>
        {onDone ? (
          <button
            type="button"
            autoFocus
            onClick={onDone}
            className={PRIMARY_PILL_CLASS_NAME}
          >
            Done
          </button>
        ) : null}
        <button
          type="button"
          autoFocus={!onDone}
          onClick={onAgain}
          className={QUIET_BUTTON_CLASS_NAME}
        >
          <RotateCcw className="size-4" aria-hidden />
          Play again
        </button>
      </motion.div>
    </div>
  );
}
