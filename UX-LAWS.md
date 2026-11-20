# Laws of UX — Frontend Reference (Mobile vs. Desktop)

Source list: https://lawsofux.com/ (30 laws, © Jon Yablonski). Definitions below are paraphrased;
the mobile/desktop rules, examples and ASCII sketches are implementation guidance for frontend work.

Each entry: **Definition → What it controls → Mobile rule → Desktop rule → Example → ASCII**

Categories (to help the skill pick laws per task):

| Category                           | Laws                                                                                                     |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| A. Perception / Grouping (Gestalt) | Common Region, Proximity, Prägnanz, Similarity, Uniform Connectedness, Von Restorff, Selective Attention |
| B. Memory / Cognition              | Chunking, Cognitive Load, Miller's Law, Working Memory, Serial Position, Mental Model, Cognitive Bias    |
| C. Decisions / Choice              | Hick's Law, Choice Overload, Occam's Razor, Pareto, Tesler's Law                                         |
| D. Motor / Interaction             | Fitts's Law, Doherty Threshold, Postel's Law, Jakob's Law, Paradox of the Active User                    |
| E. Motivation / Emotion            | Aesthetic-Usability, Flow, Goal-Gradient, Peak-End, Zeigarnik, Parkinson's Law                           |

---

## A. Perception / Grouping

### 1. Law of Proximity

**Definition:** Elements placed close together are perceived as belonging together.
**Controls:** Spacing system, form grouping, label↔field binding.
**Mobile:** Spacing is your main grouping tool (no room for borders everywhere). Label sits 4–8px above its field; 24–32px between field groups. Never let a label sit equidistant between two fields.
**Desktop:** Same rule, but more whitespace allows side-by-side groups (2 columns) — keep inner gap < outer gap.
**Example:** Login form — "Password" label tight to its input, larger gap before "Forgot password?" block.

```
BAD                    GOOD
Email                  Email
                       [__________]
[__________]
                       Password
Password               [__________]

[__________]           [  Sign in  ]
```

### 2. Law of Common Region

**Definition:** Elements inside a shared, clearly bounded area are seen as a group.
**Controls:** Cards, sections, list containers, bottom sheets.
**Mobile:** Use cards/sheets to group a whole task (e.g. one wound case = one card). Avoid nested boxes >2 levels — it eats horizontal space.
**Desktop:** Panels, sidebars, grouped settings sections with background/borders.
**Example:** Course list — each course is a card containing title, progress, CTA.

```
+--------------------+
| Wound Case 03      |
| ███████░░░  70%    |
| [ Continue ]       |
+--------------------+
```

### 3. Law of Similarity

**Definition:** Elements that look alike (color, shape, size) are perceived as related.
**Controls:** Component consistency, link/button styling, icon systems.
**Mobile:** All tappable things must share one visual language (e.g. all primary actions = filled pill). A non-tappable element must NOT look like a button.
**Desktop:** Same + hover states reinforce similarity; consistent link color across page.

```
[ Save ] [ Next ] [ Send ]   <- all actions look the same
  Info text (no button look)
```

### 4. Law of Uniform Connectedness

**Definition:** Visually connected elements (lines, frames, shared color) are seen as more related than unconnected ones.
**Controls:** Steppers, timelines, node editors (XYFlow!), tabs.
**Mobile:** Use connecting lines in vertical steppers/timelines; selected tab connected to its content.
**Desktop:** Node graphs, connectors between related panels, breadcrumb trails.

```
 ●───●───○───○        Step 2 of 4
 1   2   3   4
```

### 5. Law of Prägnanz (Simplicity)

**Definition:** People interpret complex or ambiguous visuals in the simplest possible form, because it requires the least effort.
**Controls:** Icon design, illustrations, layout shapes.
**Mobile:** Simple, bold icons with labels; avoid detailed illustrations at small sizes. Simple rectangular layouts.
**Desktop:** More detail is tolerable, but still prefer clean geometric shapes.

```
 Complex ✗           Simple ✓
 ╱╲╳╱╲╳              ┌──┐
 ╲╱╳╲╱╳              │  │  ○
                     └──┘
```

### 6. Von Restorff Effect (Isolation Effect)

**Definition:** Among similar items, the one that differs is most likely to be noticed and remembered.
**Controls:** Primary CTA, alerts, "recommended" badges.
**Mobile:** Exactly ONE visually distinct primary action per screen (usually bottom / thumb zone). Don't rely on color alone (accessibility) — add size, weight or icon.
**Desktop:** Highlight recommended plan, primary button in a toolbar.
**Caution:** If everything is highlighted, nothing is.

```
[ Back ]  [ Skip ]  [■■ CONTINUE ■■]
```

### 7. Selective Attention

**Definition:** People focus only on a subset of stimuli — usually those related to their goal — and ignore the rest.
**Controls:** Banner blindness, notification placement, where to put critical info.
**Mobile:** Put critical info inside the user's task path (inline under the field), not in banners. Ads/banner-like styling gets ignored.
**Desktop:** Avoid placing important info in right sidebars (classic banner blindness zone).

```
 [ Answer field      ]
  ⚠ Must be 3+ words      <- seen (in task path)

 ┌ BANNER: new update! ┐  <- ignored
```

---

## B. Memory / Cognition

### 8. Cognitive Load

**Definition:** The amount of mental resources needed to understand and use an interface.
**Controls:** Screen density, number of decisions per screen, jargon.
**Mobile:** One primary task per screen; progressive disclosure (accordion, "More" sheet); keyboard-open state halves the screen → even less per view.
**Desktop:** Can show more simultaneously, but group and prioritize; avoid dashboard overload.

```
MOBILE                 DESKTOP
┌──────────┐          ┌────────┬───────────────┐
│ Question │          │ Nav    │ Question      │
│ [Answer] │          │        │ [Answer] Help │
│ [ Next ] │          │        │ [ Next ]      │
└──────────┘          └────────┴───────────────┘
```

### 9. Chunking

**Definition:** Breaking information into small, meaningful groups so it is easier to process.
**Controls:** Long forms, phone/IBAN fields, content structure.
**Mobile:** Split long forms into steps; format inputs (`0171 234 5678`); short paragraphs with headings.
**Desktop:** Sections with headings, grouped settings.

```
4915112345678   →   +49 151 1234 5678
```

### 10. Miller's Law

**Definition:** Working memory holds roughly 7 (±2) items. (Use as "keep it small", not as a hard limit.)
**Controls:** Nav item counts, menu length, step counts.
**Mobile:** Bottom nav: 3–5 items max. Longer lists → grouped + searchable.
**Desktop:** Top nav ~5–7 items; mega menus grouped in chunks.

```
[🏠] [📚] [🎮] [👤]        <- 4 tabs, fine
```

### 11. Working Memory

**Definition:** A short-term system that temporarily holds and manipulates information needed for the current task.
**Controls:** Whether users must remember things across screens.
**Mobile:** Never make users remember info from a previous screen — repeat it (e.g. show the question while answering; thumbnail of the wound image when keyboard opens). Recognition over recall.
**Desktop:** Split views/side panels can keep reference info visible.

```
Screen 2:  "Q: What wound stage?"   <- question repeated
           [ answer...          ]
```

### 12. Serial Position Effect

**Definition:** People best remember the first and last items in a series.
**Controls:** Order of nav items, lists, onboarding steps.
**Mobile:** Most important tabs at the far left and far right of the bottom nav; key info at start and end of a card.
**Desktop:** Important nav items at start/end; least important in the middle.

```
[Home] [x] [y] [z] [Profile]
  ^ remembered        ^ remembered
```

### 13. Mental Model

**Definition:** A compressed internal model of how a user believes a system works.
**Controls:** Naming, icon meaning, interaction expectations.
**Mobile:** Match OS conventions: swipe back (iOS), system back (Android), pull to refresh, bottom sheets.
**Desktop:** Right-click, keyboard shortcuts, hover reveals, drag-and-drop.
**Example:** Teachers expect "Publish" to make a game visible — don't call it "Deploy".

### 14. Cognitive Bias

**Definition:** Systematic errors in thinking that influence perception and decisions.
**Controls:** Defaults, framing, feedback wording.
**Mobile/Desktop:** Use defaults responsibly (default bias); frame feedback positively; never use biases as dark patterns (GDPR/consent: no pre-ticked boxes).

```
[✓] Send me newsletter   ✗ (dark pattern, not GDPR-compliant)
[ ] Send me newsletter   ✓
```

---

## C. Decisions / Choice

### 15. Hick's Law

**Definition:** Decision time increases with the number and complexity of choices.
**Controls:** Menus, option lists, action bars.
**Mobile:** Show 1 primary + max 2 secondary actions; rest behind "⋯" or a bottom sheet.
**Desktop:** More visible actions OK in toolbars, but group them.

```
MOBILE: [ Continue ]  ⋯       DESKTOP: [Save][Preview][Share][Publish] ⋯
```

### 16. Choice Overload

**Definition:** Too many options overwhelm people and reduce satisfaction or cause them to not decide at all (paradox of choice).
**Controls:** Filters, product/course catalogs, settings.
**Mobile:** Offer a recommended default + "show all"; filters in a sheet, not all inline.
**Desktop:** Comparison tables with a highlighted recommended option.

```
★ Recommended: Wound Basics
  [ Start ]
  See all 24 courses →
```

### 17. Occam's Razor

**Definition:** Among competing solutions that work equally well, choose the one with the fewest assumptions — i.e. the simplest.
**Controls:** Feature scope, UI element count.
**Mobile/Desktop:** Remove any element that doesn't serve the task; if two designs test equally, ship the simpler one.

### 18. Pareto Principle (80/20)

**Definition:** Roughly 80% of effects come from 20% of causes.
**Controls:** Prioritization of features and UI space.
**Mobile:** The 20% most-used features get the bottom nav and home screen; everything else goes to settings/menus.
**Desktop:** Same prioritization, more space for secondary features.

### 19. Tesler's Law (Conservation of Complexity)

**Definition:** Every system has an amount of complexity that cannot be removed — only moved (to the system or the user).
**Controls:** Who carries the complexity: code or user.
**Mobile:** Move it into the system: autofill, smart defaults, `inputmode`, camera input instead of typing, auto-format.
**Desktop:** Same; power users may get advanced options, but defaults should work.

```
User types "Reutl..." → system suggests "Kreiskliniken Reutlingen"
```

---

## D. Motor / Interaction

### 20. Fitts's Law

**Definition:** Time to reach a target depends on its distance and size.
**Controls:** Button size, placement, touch targets.
**Mobile:** Min 44×44pt (iOS) / 48×48dp (Android); primary action in the thumb zone (bottom-center); full-width buttons; spacing ≥ 8px between targets; destructive actions away from primary ones.
**Desktop:** Cursor is precise, so targets can be smaller (≥ 24px), but screen edges/corners are "infinitely large" targets (menus, docks).

```
MOBILE thumb zone
┌──────────────┐  hard to reach
│   ✗ ✗ ✗      │
│              │  okay
│   ✓ ✓ ✓      │  easy
│ [  PRIMARY  ]│  <- full width, bottom
└──────────────┘
```

### 21. Doherty Threshold

**Definition:** Productivity rises when system and user interact at < 400ms, so neither waits on the other.
**Controls:** Perceived performance, loading states.
**Mobile:** Optimistic updates, skeleton loaders, instant tap feedback (< 100ms); preload next game node; slower networks → design for it.
**Desktop:** Same, but faster networks; still use skeletons for > 400ms.

```
┌──────────────┐
│ ▒▒▒▒▒▒▒▒     │   skeleton while loading
│ ▒▒▒▒▒        │
│ ▒▒▒▒▒▒▒▒▒▒   │
└──────────────┘
```

### 22. Postel's Law (Robustness Principle)

**Definition:** Be liberal in what you accept, conservative in what you send.
**Controls:** Input validation, parsing.
**Mobile:** Accept `0171-123 45`, `+49171...`, trailing spaces, lowercase emails; normalize internally. Typing on mobile is error-prone, so be forgiving.
**Desktop:** Same; also accept paste of formatted text.

```
Input: " Max@Mail.DE "  → stored: "max@mail.de"
```

### 23. Jakob's Law

**Definition:** Users spend most of their time on other sites, so they expect yours to work the same way.
**Controls:** Conventions, pattern choice.
**Mobile:** Bottom tab bar, hamburger only for secondary items, back gesture, pull-to-refresh, standard icons.
**Desktop:** Logo top-left → home, search top-right, nav at top.

### 24. Paradox of the Active User

**Definition:** Users never read manuals; they start using the software immediately.
**Controls:** Onboarding, help placement.
**Mobile:** Contextual hints/tooltips at the moment of need, empty states that teach, no 5-screen intro carousel.
**Desktop:** Inline hints, hover tooltips, guided first action.

```
┌───────────────────────────┐
│  No games yet             │
│  Tap + to create your     │
│  first wound case  ↓      │
│                    [ + ]  │
└───────────────────────────┘
```

---

## E. Motivation / Emotion

### 25. Aesthetic-Usability Effect

**Definition:** Users perceive aesthetically pleasing design as more usable.
**Controls:** Visual polish, trust, tolerance for small issues.
**Mobile/Desktop:** Consistent spacing, typography and color raise trust (important for clinics/schools). But polish can hide usability problems in tests — observe behavior, not just opinions.

### 26. Flow

**Definition:** A mental state of full, energized focus and enjoyment in an activity.
**Controls:** Challenge vs. skill balance, interruptions.
**Mobile:** No interruptions during a game task (no modals, no notifications); immediate feedback; difficulty that adapts.
**Desktop:** Same; full-screen mode for focused tasks.

```
challenge ↑   anxiety
              /  FLOW
             /
   boredom  /
           → skill
```

### 27. Goal-Gradient Effect

**Definition:** Motivation to reach a goal increases as people get closer to it.
**Controls:** Progress indicators, gamification.
**Mobile:** Visible progress bar at the top; start progress at > 0 ("Step 1 done ✓" after signup); show "2 left!".
**Desktop:** Same; profile completion meters.

```
Case progress  ████████░░  8/10  — 2 left!
```

### 28. Peak-End Rule

**Definition:** People judge an experience mostly by how it felt at its peak and at its end, not the average.
**Controls:** Success screens, error recovery, end of flows.
**Mobile:** Design a strong end screen (score, feedback, celebration); make the worst moment (an error) gentle and recoverable.
**Desktop:** Same.

```
┌────────────────────┐
│     🎉 Well done!  │
│   Score: 92/100    │
│  [ Next case → ]   │
└────────────────────┘
```

### 29. Zeigarnik Effect

**Definition:** People remember uncompleted or interrupted tasks better than completed ones.
**Controls:** Resume features, drafts, open-task lists.
**Mobile:** "Continue where you left off" on home; autosave game progress (mobile sessions get interrupted constantly).
**Desktop:** Same; unfinished drafts list.

```
┌──────────────────────────┐
│ ▶ Continue: Case 04 (60%)│
└──────────────────────────┘
```

### 30. Parkinson's Law

**Definition:** A task expands to fill all the time available for it.
**Controls:** Flow length, time-boxing.
**Mobile:** Keep tasks short; autofill; show estimated time ("2 min"); optional timers in game rounds.
**Desktop:** Same; time estimates on longer modules.

```
Case 05 · ⏱ ~3 min
```

---

## Quick Selector (for the skill)

| Designing…                 | Apply first                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| Form / input with keyboard | Proximity, Chunking, Postel, Tesler, Working Memory, Fitts            |
| Navigation                 | Miller, Serial Position, Jakob, Hick, Pareto                          |
| Primary action / CTA       | Fitts, Von Restorff, Hick                                             |
| Loading / performance      | Doherty Threshold                                                     |
| Onboarding / empty states  | Paradox of Active User, Goal-Gradient, Tesler                         |
| Game task / learning flow  | Flow, Goal-Gradient, Peak-End, Zeigarnik, Cognitive Load              |
| Lists / catalogs           | Choice Overload, Hick, Common Region, Similarity                      |
| Visual grouping            | Proximity, Common Region, Similarity, Uniform Connectedness, Prägnanz |
| Consent / defaults         | Cognitive Bias (no dark patterns)                                     |
