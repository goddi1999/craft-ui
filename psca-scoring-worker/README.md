# math-scoring-worker (`@wq/psca-scoring`)

Standalone math-scoring library implementing the **Partial Scoring Carry Algorithm (PSCA)** for step-based math exercises (WQ-24 / WQ-55). It receives normalized scoring inputs (`StepNode[]`, `StudentStep` map, `ScoringConfig`, `pointsMax`) and returns a deterministic `PscaResult`.

No React, no canvas, no Supabase, no runtime dependencies — only pure TypeScript math. Same architectural boundary as `auto-scoring-worker/` (Open Question grading), delivered as a library in Phase 1 (an HTTP boundary is an optional Phase 2, documented below).

---

## Request flow (technical)

```
Consumer (Game Studio adapter or future caller)
  │  maps authored steps → StepNode[] + StudentStep map
  │  (adapter stays in the feature — the package never sees canvas rows)
  ▼
  │  builds PscaScoreRequest { tree, studentAnswers, config, pointsMax }
  ▼
@wq/psca-scoring  →  runPscaPipeline(request)
  │  src/psca/pipeline.ts — edge cases (empty tree, pointsMax ≤ 0), clamping
  ▼
src/psca/pscaScoring.ts
  │  validates tree → topo-sorts → per-step m/s/e → R component → weighted score
  ▼
PscaResult { score, R, S, M, E, perStep[], awardedPoints }
```

### Step-by-step

1. **`pipeline.ts`** — Public orchestrator `runPscaPipeline()`. Handles the WQ-55 edge-case contract (see _Error states_), then delegates to the pure core and clamps `awardedPoints` to `[0, pointsMax]`.
2. **`pscaScoring.ts`** — The PSCA core. Validates weights and tree, topologically sorts the steps, computes per-step `m` (method), `s` (step), `e` (error-free) plus the final-node `R` (result), and blends them: `score = w_r·R + w_s·S + w_m·M + w_e·E`.
3. **`carryResolver.ts`** — Resolves referenced operands per `config.mode`: `carry` uses upstream student actuals (no double penalty for follow-up errors); `strict` always uses the model solution.
4. **`stepTree.ts`** — `validateStepTree` (unknown deps, cycles), `topoSort`, `getFinalNode`. Structural failures throw `PscaValidationError` with `code: 'INVALID_STEP_TREE'`.
5. **`operatorMatch.ts`** — **M** component per step: `1` exact operator, `0.5` didactically related (`Σ` ↔ `+`), else `0`.
6. **`errorFreeChecks.ts`** — **E** component per step: average of unit / notation / concept subscores.
7. **`toleranceWindow.ts`** — `ε = max(abs, rel · |expected|)` per step.

---

## Folder layout

```
math-scoring-worker/             # package name: @wq/psca-scoring
├── src/
│   ├── index.ts                 ← public barrel (the only import surface)
│   ├── constants.ts             ← DEFAULT_SCORING_WEIGHTS, DEFAULT_SCORING_CONFIG, R_ONLY_SCORING_CONFIG
│   ├── schemas.ts               ← StepNode, StudentStep, ScoringConfig, PscaScoreRequest, PscaResult
│   ├── errors.ts                ← PscaValidationError ('INVALID_STEP_TREE')
│   └── psca/
│       ├── pipeline.ts          ← runPscaPipeline() orchestrator
│       ├── pscaScoring.ts       ← weighted score + awardedPoints
│       ├── carryResolver.ts     ← carry | strict operand resolution
│       ├── stepTree.ts          ← topoSort, validateStepTree, getFinalNode
│       ├── operatorMatch.ts     ← M component
│       ├── errorFreeChecks.ts   ← E component
│       └── toleranceWindow.ts   ← ε computation
├── tests/
│   └── pscaScoring.test.ts      ← core + pipeline + error-state tests (Lohnkosten worked example)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## API contract (Phase 1 — library)

### `runPscaPipeline(request: PscaScoreRequest): PscaResult`

**Request**

| Field            | Type                          | Meaning                                                          |
| ---------------- | ----------------------------- | ---------------------------------------------------------------- |
| `tree`           | `StepNode[]`                  | Teacher model solution as a DAG (ids, operators, operands, deps) |
| `studentAnswers` | `Record<string, StudentStep>` | Committed student values keyed by `nodeId`                       |
| `config`         | `ScoringConfig`               | Weights, `mode` (`carry` \| `strict`), tolerance, `graceful`     |
| `pointsMax`      | `number`                      | Game maximum points for this exercise                            |

**Result** (`PscaResult`, semantics per Notion §11)

| Field           | Meaning                                                      |
| --------------- | ------------------------------------------------------------ |
| `score`         | Weighted total in `[0, 1]`: `w_r·R + w_s·S + w_m·M + w_e·E`  |
| `R` `S` `M` `E` | Component averages (result / steps / method / error-free)    |
| `perStep[]`     | Per node: `nodeId`, `m`, `s`, `e`, `expectedCarry`, `actual` |
| `awardedPoints` | `score × pointsMax`, clamped to `[0, pointsMax]`             |

**Rules**

- Weights must sum to `1`; default profile `0.50 / 0.30 / 0.15 / 0.05` (`DEFAULT_SCORING_CONFIG`).
- `config.mode` supports `carry` (default) and `strict` per Notion §5.1.
- Preview MVP uses `R_ONLY_SCORING_CONFIG` (`result: 1`, others `0`) — only **R** affects points; S/M/E are still returned for diagnostics.

### Error states

| Input                             | Behavior                                                            |
| --------------------------------- | ------------------------------------------------------------------- |
| Invalid tree (cycle, missing dep) | throws `PscaValidationError` with `code: 'INVALID_STEP_TREE'`       |
| Empty `tree`                      | returns zero score, `awardedPoints = 0`, empty `perStep` (no throw) |
| Missing student answer for a node | that step scores `s = 0`, `m = 0`, `e = 0`                          |
| `pointsMax ≤ 0`                   | `awardedPoints = 0` (no throw)                                      |

### Worked example (Lohnkosten, Notion §10)

5 steps, `pointsMax = 10`, mode `carry`, default weights. Step `n2` wrong (`100 €` instead of `114 €`), follow-ups consistent with carry: `R = 0`, `S = 0.80`, `M = 1.00`, `score ≈ 0.437`, `awardedPoints ≈ 4.37`. Covered by `tests/pscaScoring.test.ts`.

---

## Usage from the Vite app

The app depends on the package via a workspace-style `file:` alias in the root `package.json`:

```json
"@wq/psca-scoring": "file:./math-scoring-worker"
```

```ts
import { DEFAULT_SCORING_CONFIG, runPscaPipeline } from '@wq/psca-scoring'

const result = runPscaPipeline({
  tree,
  studentAnswers,
  config: DEFAULT_SCORING_CONFIG,
  pointsMax: 10,
})
```

Import only from the package barrel — never deep-import `@wq/psca-scoring/src/psca/*`. Canvas-row → domain-type adapters belong in the consuming feature; this package never sees canvas rows, Lexical HTML, or PII (DSGVO: numeric steps, operators, and unit labels only).

## Local development

```bash
cd math-scoring-worker
npm test           # vitest run — no React, Vite app, or Game Studio imports involved
npm run type-check # tsc --noEmit against the package's own tsconfig
```

Tests also run as part of the repo-wide `npx vitest run`.

---

## Design constraints

- **Deterministic** — same request → same `PscaResult`; no randomness, no clock, no I/O.
- **Zero runtime deps** — plain TypeScript; `tsconfig` has no DOM lib, so browser/React APIs cannot creep in.
- **No formula changes here** — PSCA weights, tolerance semantics, and mode behavior are canonical in Notion (partial_scoring_carry_algorithm §1–§12); this package only hosts the implementation.
- **Boundary** — adapters (canvas parsing, token inference, failed-chip highlighting) belong to the consuming feature, not the package.

---

## Optional Phase 2 — HTTP worker boundary (not part of Phase 1)

Mirrors `auto-scoring-worker/` if server-side scoring becomes necessary (e.g. live sessions with persistence):

1. Endpoint `POST /math-score/` accepting `PscaScoreRequest` JSON → `PscaResult` JSON, plus `GET /math-score/health`. A thin Node (or FastAPI) router would wrap `runPscaPipeline` — no algorithm changes.
2. Frontend API module mirroring `open-question/api/scoringApi.ts`.
3. Env var `VITE_MATH_SCORING_WORKER_URL` for a self-hosted deployment; a `docker-compose.yml` service with a healthcheck on `GET /math-score/health` would live in this folder.

DSGVO note for Phase 2: the request body already contains only normalized numeric steps — no raw student text ever crosses the wire.
