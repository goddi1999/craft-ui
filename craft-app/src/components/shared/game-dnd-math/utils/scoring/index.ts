/**
 * Canvas → PSCA adapter boundary.
 *
 * The PSCA algorithm itself lives in the decoupled package `@wq/psca-scoring`
 * (repo root: `psca-scoring-worker/`). Only canvas-row mapping stays here.
 */
export {
  buildTeacherStepTree,
  buildStudentAnswers,
  extractCanvasScoringSteps,
  resolveFailedStepTokenIds,
} from './canvasStepAdapter'
