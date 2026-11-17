import { useMemo, useState } from "react";

import {
  DemoAction,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from "@/components/shared/demo-controls";
import {
  toUsageSnippet,
  type DemoPropDoc,
} from "@/components/shared/demo-docs";
import { DemoPage } from "@/components/shared/demo-page";
import {
  ConjugationQuiz,
  buildQuizQuestions,
  type QuizVerb,
} from "@/components/ui/conjugation-quiz";

function verb(infinitive: string, forms: string[]): QuizVerb {
  return {
    infinitive,
    forms: forms.map((form, index) => ({
      person: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6,
      form,
    })),
  };
}

const VERBS: QuizVerb[] = [
  verb("comer", ["como", "comes", "come", "comemos", "coméis", "comen"]),
  verb("hablar", ["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"]),
  verb("vivir", ["vivo", "vives", "vive", "vivimos", "vivís", "viven"]),
  verb("hacer", ["hago", "haces", "hace", "hacemos", "hacéis", "hacen"]),
];

const DEFAULTS = { tooEasy: true, exit: true, keyboard: true };

const PROPS: DemoPropDoc[] = [
  {
    name: "questions",
    type: "ConjugationQuizQuestion[]",
    description:
      "Prompts in order; build them from verbs with buildQuizQuestions(verbs, language).",
  },
  {
    name: "onAnswer",
    type: "(question, picked, verdict) => void",
    description: "Fires as soon as a choice is picked.",
  },
  {
    name: "onTooEasy",
    type: "(question) => void",
    description: 'Adds "Too easy" after a correct answer.',
  },
  {
    name: "onComplete",
    type: "(stats) => void",
    description: "Once per round, with right / wrong / total.",
  },
  {
    name: "onExit",
    type: "() => void",
    description: "Shows Exit, and Done on the round-complete screen.",
  },
  {
    name: "keyboard",
    type: "boolean",
    default: "true",
    description: "Keys 1–4 pick a choice, Enter goes on.",
  },
];

export function ConjugationQuizPage() {
  const settings = useDemoSettings(DEFAULTS);
  const { tooEasy, exit, keyboard } = settings.values;
  const [deal, setDeal] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = useMemo(() => buildQuizQuestions(VERBS, "es"), [deal]);

  const usage = toUsageSnippet({
    component: "ConjugationQuiz",
    from: "@/components/ui/conjugation-quiz",
    props: {
      questions: { expression: "buildQuizQuestions(verbs, 'es')" },
      onAnswer: { expression: "saveReview" },
      ...(tooEasy ? { onTooEasy: { expression: "markEasy" } } : {}),
      ...(exit ? { onExit: { expression: "leave" } } : {}),
      keyboard,
    },
    defaults: { keyboard: true },
  });

  return (
    <DemoPage
      eyebrow="ui / conjugation-quiz"
      title="Conjugation Quiz"
      description="Pick the right form for the person shown. The prompt blurs and slides between questions, the choices drop in one by one, the right answer pops green and a wrong pick shakes, and the round ends on a check that draws itself. Every timing lives in QUIZ_MOTION."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Too easy"
            checked={tooEasy}
            onCheckedChange={(next) => settings.set("tooEasy", next)}
          />
          <DemoSwitch
            label="Exit"
            checked={exit}
            onCheckedChange={(next) => settings.set("exit", next)}
          />
          <DemoSwitch
            label="Keys 1–4"
            checked={keyboard}
            onCheckedChange={(next) => settings.set("keyboard", next)}
          />
          <DemoAction onClick={() => setDeal((d) => d + 1)}>
            New round
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: ["src/components/ui/conjugation-quiz/"],
        usage,
        props: PROPS,
      }}
    >
      <ConjugationQuiz
        key={deal}
        questions={questions}
        keyboard={keyboard}
        onTooEasy={tooEasy ? () => {} : undefined}
        onExit={exit ? () => setDeal((d) => d + 1) : undefined}
      />
    </DemoPage>
  );
}
