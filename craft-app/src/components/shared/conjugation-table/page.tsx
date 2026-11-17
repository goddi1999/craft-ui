import {
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
  ConjugationTable,
  type ConjugationVerb,
} from "@/components/ui/conjugation-table";

function present(
  id: string,
  infinitive: string,
  translation: string,
  forms: string[],
): ConjugationVerb {
  return {
    id,
    infinitive,
    translation,
    forms: forms.map((form, index) => ({
      person: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6,
      form,
    })),
  };
}

const VERBS: ConjugationVerb[] = [
  present("abrir", "abrir", "to open", [
    "abro",
    "abres",
    "abre",
    "abrimos",
    "abrís",
    "abren",
  ]),
  present("caminar", "caminar", "to walk", [
    "camino",
    "caminas",
    "camina",
    "caminamos",
    "camináis",
    "caminan",
  ]),
  present("comer", "comer", "to eat", [
    "como",
    "comes",
    "come",
    "comemos",
    "coméis",
    "comen",
  ]),
  present("conseguir", "conseguir", "to get", [
    "consigo",
    "consigues",
    "consigue",
    "conseguimos",
    "conseguís",
    "consiguen",
  ]),
  present("hacer", "hacer", "to do", [
    "hago",
    "haces",
    "hace",
    "hacemos",
    "hacéis",
    "hacen",
  ]),
  present("vivir", "vivir", "to live", [
    "vivo",
    "vives",
    "vive",
    "vivimos",
    "vivís",
    "viven",
  ]),
];

const DEFAULTS = { showMenu: true };

const PROPS: DemoPropDoc[] = [
  {
    name: "verbs",
    type: "ConjugationVerb[]",
    description: "Verbs on the wheel, each with its six forms (person 1–6).",
  },
  {
    name: "value",
    type: "string",
    description: "Id of the verb on the wheel; uncontrolled when omitted.",
  },
  {
    name: "onValueChange",
    type: "(verbId: string) => void",
    description: "Called once the wheel settles on a new verb.",
  },
  {
    name: "language",
    type: "'de' | 'es' | 'fr' | 'pt'",
    default: "'es'",
    description: "Pronoun labels and speech voice.",
  },
  {
    name: "onSpeak",
    type: "(form: string) => void",
    description: "Speaker tap; defaults to the device speech synthesis.",
  },
  {
    name: "onEdit / onRemove",
    type: "(verb) => void",
    description:
      "Rows in the card … menu; the menu hides when both are omitted.",
  },
  {
    name: "title",
    type: "string",
    default: "'Conjugation Table'",
    description: "Heading above the wheel; empty string hides it.",
  },
];

export function ConjugationTablePage() {
  const settings = useDemoSettings(DEFAULTS);
  const { showMenu } = settings.values;

  const usage = toUsageSnippet({
    component: "ConjugationTable",
    from: "@/components/ui/conjugation-table",
    props: {
      verbs: { expression: "verbs" },
      language: "es",
      ...(showMenu
        ? {
            onEdit: { expression: "editVerb" },
            onRemove: { expression: "removeVerb" },
          }
        : {}),
    },
    defaults: { language: "es" },
  });

  return (
    <DemoPage
      eyebrow="ui / conjugation-table"
      title="Conjugation Table"
      description="An iOS-style scroll-snapping verb wheel above a card of the six present-tense forms. Scroll or tap a verb; tap a speaker to hear the form in the device's own voice."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Menu"
            checked={showMenu}
            onCheckedChange={(next) => settings.set("showMenu", next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: [
          "src/components/ui/conjugation-table/",
          "src/components/ui/deck-card/",
        ],
        usage,
        props: PROPS,
      }}
    >
      <ConjugationTable
        verbs={VERBS}
        defaultValue="comer"
        title=""
        language="es"
        onEdit={showMenu ? () => {} : undefined}
        onRemove={showMenu ? () => {} : undefined}
      />
    </DemoPage>
  );
}
