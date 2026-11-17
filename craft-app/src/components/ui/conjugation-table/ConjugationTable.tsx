import { useState } from "react";
import { Pencil, Trash2, Volume2 } from "lucide-react";

import { DeckCardMenu } from "@/components/ui/deck-card";
import { cn } from "@/lib/utils";

import type {
  ConjugationCardProps,
  ConjugationTableProps,
} from "./conjugation-table.types";
import { personLabel, speakForm } from "./conjugation-table.utils";
import { WheelPicker } from "./WheelPicker";

const menuItemClassName = cn(
  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
  "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
);

/** One verb's six present-tense forms; tap the speaker to hear a form. */
export function ConjugationCard({
  verb,
  language = "es",
  onSpeak,
  onEdit,
  onRemove,
  className,
}: ConjugationCardProps) {
  const speak = onSpeak ?? ((form: string) => speakForm(form, language));
  const hasMenu = Boolean(onEdit || onRemove);

  return (
    <section
      aria-label={`Present tense of ${verb.infinitive}`}
      className={cn("rounded-3xl bg-muted/60 p-2", className)}
    >
      <div className="flex min-h-9 items-center gap-1 pl-3">
        <p className="min-w-0 flex-1 truncate text-lg text-muted-foreground">
          {verb.translation?.trim() || verb.infinitive}
        </p>
        {hasMenu ? (
          <DeckCardMenu
            ariaLabel={`Actions for ${verb.infinitive}`}
            triggerClassName="size-9"
            contentClassName="w-52"
          >
            {onEdit ? (
              <button
                type="button"
                className={menuItemClassName}
                onClick={() => onEdit(verb)}
              >
                <Pencil />
                Edit forms
              </button>
            ) : null}
            {onRemove ? (
              <button
                type="button"
                className={cn(
                  menuItemClassName,
                  "text-destructive [&_svg]:text-destructive",
                )}
                onClick={() => onRemove(verb)}
              >
                <Trash2 />
                Remove table
              </button>
            ) : null}
          </DeckCardMenu>
        ) : null}
      </div>

      <div className="mt-1 divide-y divide-border/60 rounded-3xl bg-background px-4">
        {verb.forms.map((form) => (
          <div
            key={form.person}
            className="flex min-h-[56px] items-center gap-3 py-1"
          >
            <button
              type="button"
              onClick={() => speak(form.form)}
              aria-label={`Play ${form.form}`}
              className="grid size-10 flex-none place-items-center rounded-full bg-muted text-muted-foreground transition-transform active:scale-95"
            >
              <Volume2 className="size-4" />
            </button>
            <span className="min-w-0 flex-1 truncate text-[15px] text-muted-foreground">
              {personLabel(language, form.person)}
            </span>
            <span className="text-lg font-semibold">{form.form}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * A reference table of conjugated verbs: scroll the wheel to a verb, read its six
 * present-tense forms in the card below, tap one to hear it.
 */
export function ConjugationTable({
  verbs,
  value,
  defaultValue,
  onValueChange,
  title = "Conjugation Table",
  className,
  ...cardProps
}: ConjugationTableProps) {
  const [innerValue, setInnerValue] = useState(defaultValue ?? verbs[0]?.id ?? "");
  const selectedId = value ?? innerValue;
  const selected = verbs.find((verb) => verb.id === selectedId) ?? verbs[0];

  if (!selected) return null;

  return (
    <div
      className={cn("mx-auto flex w-full max-w-md flex-col gap-4", className)}
    >
      {title ? (
        <h1 className="px-1 pt-2 text-2xl font-semibold">{title}</h1>
      ) : null}

      <WheelPicker
        options={verbs.map((verb) => verb.infinitive)}
        value={selected.infinitive}
        onValueChange={(infinitive) => {
          const match = verbs.find((verb) => verb.infinitive === infinitive);
          if (!match) return;
          setInnerValue(match.id);
          onValueChange?.(match.id);
        }}
        aria-label="Verb"
      />

      <ConjugationCard verb={selected} {...cardProps} />
    </div>
  );
}
