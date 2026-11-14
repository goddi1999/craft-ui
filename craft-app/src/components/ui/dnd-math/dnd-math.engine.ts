/**
 * Equation evaluation: typed text → tokens → structure and unit checks → arithmetic.
 *
 * Security: the student's text never reaches `eval` or a general-purpose math library. Units are
 * checked and stripped first, and only digits, `+ - * /`, dots and brackets reach the small
 * arithmetic parser below, which can't call anything.
 */

import {
  applyBinaryRule,
  blockedMessage,
  categoryOnly,
  findUnit,
  UNIT_KEYS,
  type BinaryOperator,
  type UnitCategory,
  type UnitDefinition,
} from './dnd-math.units'
import type { DnDMathOperator } from './dnd-math.types'

type Token =
  | { kind: 'number'; raw: string; value: number }
  | { kind: 'operator'; op: BinaryOperator; raw: string }
  | { kind: 'paren'; symbol: '(' | ')' }
  | { kind: 'unit'; raw: string; def: UnitDefinition }
  | { kind: 'unknown'; raw: string }

export type EvaluateSuccess = {
  ok: true
  /** The equation as shown on the chip: `40 × 8,50 €`. */
  expression: string
  value: number
  /** Display unit of the result, `''` for a plain number. */
  unit: string
  category: UnitCategory
  operator: DnDMathOperator
}

export type EvaluateFailure = { ok: false; message: string }
export type EvaluateResult = EvaluateSuccess | EvaluateFailure

const OPERATOR_GLYPHS: Record<string, BinaryOperator> = {
  '×': '*',
  '·': '*',
  x: '*',
  '*': '*',
  '÷': '/',
  ':': '/',
  '/': '/',
  '−': '-',
  '-': '-',
  '+': '+',
}
const DISPLAY_OPERATOR: Record<BinaryOperator, string> = { '+': '+', '-': '−', '*': '×', '/': '÷' }
const NUMBER = /^-?\d+(?:[.,]\d+)?$/

const matchUnitAt = (text: string, index: number) =>
  UNIT_KEYS.find((key) => text.startsWith(key, index)) ?? null

/** A minus is a sign (not subtraction) at the start or right after an operator or `(`. */
function isSignAt(text: string, index: number): boolean {
  let prev = index - 1
  while (prev >= 0 && /\s/.test(text[prev])) prev -= 1
  return prev < 0 || /[(+\-*/×÷·−:x]/.test(text[prev])
}

function readNumber(text: string, start: number): number {
  let end = start + (text[start] === '-' ? 1 : 0)
  while (/\d/.test(text[end] ?? '')) end += 1
  if (/[.,]/.test(text[end] ?? '') && /\d/.test(text[end + 1] ?? '')) {
    end += 1
    while (/\d/.test(text[end] ?? '')) end += 1
  }
  return end
}

/** Splits typed text into raw pieces, peeling glued units off numbers (`8,5€`, `11h`, `25kW`). */
export function splitEquation(raw: string): string[] {
  const text = raw.replace(/\u00a0/g, ' ').trim()
  const pieces: string[] = []
  let i = 0
  while (i < text.length) {
    const char = text[i]
    if (/\s/.test(char)) {
      i += 1
      continue
    }
    const signed = char === '-' && isSignAt(text, i) && /\d/.test(text[i + 1] ?? '')
    if (/\d/.test(char) || signed) {
      const end = readNumber(text, i)
      pieces.push(text.slice(i, end))
      i = end
      continue
    }
    // a unit must end at a word boundary, so `abc` stays one unknown word instead of `a` + `bc`
    const unitKey = matchUnitAt(text, i)
    if (unitKey && !/\p{L}/u.test(text[i + unitKey.length] ?? '')) {
      pieces.push(unitKey)
      i += unitKey.length
      continue
    }
    const word = /^\p{L}+/u.exec(text.slice(i))?.[0] ?? char
    pieces.push(word)
    i += word.length
  }
  return pieces
}

function classify(raw: string): Token {
  if (raw === '(' || raw === ')') return { kind: 'paren', symbol: raw }
  const op = OPERATOR_GLYPHS[raw]
  if (op) return { kind: 'operator', op, raw }
  if (NUMBER.test(raw)) return { kind: 'number', raw, value: Number(raw.replace(',', '.')) }
  const def = findUnit(raw)
  if (def) return { kind: 'unit', raw, def }
  return { kind: 'unknown', raw }
}

const isOperand = (t: Token) => t.kind === 'number' || t.kind === 'unit'

/** Order and brackets: no operator at an end, none doubled, a number may carry one unit. */
function checkStructure(tokens: readonly Token[]): string | null {
  if (tokens.length === 0) return 'Type an equation first.'
  let depth = 0
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    const prev = tokens[i - 1]
    if (token.kind === 'unknown') return `“${token.raw}” isn't a number, operator or known unit.`
    if (token.kind === 'paren') {
      depth += token.symbol === '(' ? 1 : -1
      if (depth < 0) return 'A closing bracket has no opening one.'
      continue
    }
    if (token.kind === 'operator') {
      if (i === 0 || i === tokens.length - 1) return 'An operator needs a value on each side.'
      if (prev.kind === 'operator') return 'Two operators in a row.'
      continue
    }
    if (token.kind === 'unit' && prev?.kind !== 'number') {
      return `${token.def.displaySymbol} needs a number in front of it.`
    }
    if (prev && isOperand(prev)) {
      const numberWithUnit = prev.kind === 'number' && token.kind === 'unit'
      if (!numberWithUnit) return 'Two values need an operator between them.'
    }
  }
  return depth === 0 ? null : 'A bracket is never closed.'
}

const CATEGORY_LABEL: Partial<Record<UnitCategory, string>> = { dimensionless: 'a number' }
const label = (category: UnitCategory) => CATEGORY_LABEL[category] ?? `a ${category}`

type Operand = { category: UnitCategory; def: UnitDefinition | null }

/**
 * Units are never converted, so `3 cm + 5 m` would silently read as 8. Adding two units of one
 * quantity must use the same unit; only euros and cents convert, through the `ct` factor.
 */
function needsSameUnit(
  left: UnitDefinition | null,
  op: BinaryOperator,
  right: UnitDefinition | null,
) {
  if (!left || !right || (op !== '+' && op !== '-')) return false
  if (left.category !== right.category || left.symbol === right.symbol) return false
  return left.baseSymbol !== 'EUR' || right.baseSymbol !== 'EUR'
}

/**
 * Walks the operands left to right and carries the unit category through each operator.
 * Like the source module, this fold ignores precedence for units; the arithmetic does not.
 */
function inferCategory(tokens: readonly Token[]): { category: UnitCategory } | { message: string } {
  const operands: Operand[] = []
  const operators: BinaryOperator[] = []
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    const next = tokens[i + 1]
    if (token.kind === 'operator') operators.push(token.op)
    if (token.kind === 'number' && next?.kind === 'unit') {
      operands.push({ category: next.def.category, def: next.def })
      i += 1
    } else if (token.kind === 'number') {
      operands.push({ category: 'dimensionless', def: null })
    } else if (token.kind === 'unit') {
      operands.push({ category: token.def.category, def: token.def })
    }
  }

  let running = operands[0]
  for (let i = 0; i < operators.length; i += 1) {
    const right = operands[i + 1]
    if (!right) break
    const op = operators[i]
    const leftDef = running.def ?? categoryOnly(running.category)
    const rightDef = right.def ?? categoryOnly(right.category)
    const blocked = blockedMessage(leftDef, op, rightDef)
    if (blocked) return { message: blocked }
    if (needsSameUnit(running.def, op, right.def)) {
      return {
        message: `Write both in the same unit: ${running.def?.displaySymbol} and ${right.def?.displaySymbol}.`,
      }
    }
    const category = applyBinaryRule(running.category, op, right.category)
    if (!category) {
      return {
        message: `${label(running.category)} ${DISPLAY_OPERATOR[op]} ${label(right.category)} has no rule.`,
      }
    }
    const def =
      running.def?.category === category
        ? running.def
        : right.def?.category === category
          ? right.def
          : null
    running = { category, def }
  }
  return { category: running.category }
}

/** Units leave the arithmetic; `%` and `ct` turn into their factor. */
function toArithmetic(tokens: readonly Token[]): string {
  const out: string[] = []
  for (const token of tokens) {
    if (token.kind === 'number') out.push(String(token.value))
    if (token.kind === 'operator') out.push(token.op)
    if (token.kind === 'paren') out.push(token.symbol)
    if (token.kind === 'unit') {
      const factor = token.def.symbol === 'percent' || token.def.symbol === 'ct' ? 0.01 : 1
      if (factor !== 1) out.push(`*${factor}`)
    }
  }
  return out.join(' ')
}

/**
 * Evaluates `+ - * /`, brackets and signs with normal precedence. Throws on anything else.
 */
export function evaluateArithmetic(source: string): number {
  if (!/^[\d+\-*/().\s]+$/.test(source)) throw new Error('Unexpected character')
  const s = source.replace(/\s+/g, '')
  let i = 0

  const factor = (): number => {
    const char = s[i]
    if (char === '-' || char === '+') {
      i += 1
      return char === '-' ? -factor() : factor()
    }
    if (char === '(') {
      i += 1
      const value = sum()
      if (s[i] !== ')') throw new Error('Missing )')
      i += 1
      return value
    }
    const match = /^\d+(?:\.\d+)?/.exec(s.slice(i))
    if (!match) throw new Error('Expected a number')
    i += match[0].length
    return Number(match[0])
  }
  const product = (): number => {
    let value = factor()
    while (s[i] === '*' || s[i] === '/') {
      const op = s[i]
      i += 1
      const right = factor()
      value = op === '*' ? value * right : value / right
    }
    return value
  }
  const sum = (): number => {
    let value = product()
    while (s[i] === '+' || s[i] === '-') {
      const op = s[i]
      i += 1
      const right = product()
      value = op === '+' ? value + right : value - right
    }
    return value
  }

  const value = sum()
  if (i !== s.length) throw new Error('Unexpected input')
  return value
}

/** Default result unit per category when the operands don't share one. */
const RESULT_UNIT: Partial<Record<UnitCategory, string>> = {
  money: '€',
  percentage: '%',
  length: 'm',
  area: 'm²',
  volume: 'm³',
  capacity: 'l',
  mass: 'kg',
  time: 'h',
  energy: 'kWh',
  power: 'kW',
  speed: 'km/h',
  count: 'Stück',
  density: 'kg/m³',
}

/** Categories built by dividing one quantity by another: `€/kg`, `km/h`, `kg/m³`. */
const QUOTIENTS: readonly UnitCategory[] = ['rate', 'speed', 'density']

function resultUnit(category: UnitCategory, tokens: readonly Token[]): string {
  if (category === 'dimensionless') return ''
  const units = tokens.flatMap((t) => (t.kind === 'unit' ? [t.def] : []))
  const [first, second] = units
  const own = units.find((d) => d.category === category)
  if (own && units.every((d) => d.displaySymbol === own.displaySymbol || d.category !== category)) {
    if (units.every((d) => d.category === category) || QUOTIENTS.includes(category))
      return own.displaySymbol
  }
  // `540 € ÷ 90 kg` → `€/kg`
  if (QUOTIENTS.includes(category) && first && second) {
    return `${first.displaySymbol}/${second.displaySymbol}`
  }
  // `4 cm × 3 cm` → `cm²`
  if (
    category === 'area' &&
    first &&
    second?.symbol === first.symbol &&
    first.category === 'length'
  ) {
    return `${first.displaySymbol}²`
  }
  return RESULT_UNIT[category] ?? ''
}

/** The step's method for scoring: the strongest operator in the equation. */
function inferOperator(tokens: readonly Token[]): DnDMathOperator {
  const ops = new Set(tokens.flatMap((t) => (t.kind === 'operator' ? [t.op] : [])))
  if (ops.has('/')) return '÷'
  if (ops.has('-')) return '−'
  if (ops.has('+')) return '+'
  return '×'
}

function prettyEquation(tokens: readonly Token[]): string {
  return tokens
    .map((t) => {
      if (t.kind === 'operator') return DISPLAY_OPERATOR[t.op]
      if (t.kind === 'unit') return t.def.displaySymbol
      if (t.kind === 'paren') return t.symbol
      return t.raw
    })
    .join(' ')
    .replace(/\( /g, '(')
    .replace(/ \)/g, ')')
}

/** Evaluates one typed equation, e.g. `40 * 8,5€` → `340 €`. */
export function evaluateEquation(raw: string): EvaluateResult {
  const tokens = splitEquation(raw).map(classify)
  const structure = checkStructure(tokens)
  if (structure) return { ok: false, message: structure }

  const inferred = inferCategory(tokens)
  if ('message' in inferred) return { ok: false, message: inferred.message }

  let value: number
  try {
    value = evaluateArithmetic(toArithmetic(tokens))
  } catch {
    return { ok: false, message: "That equation can't be worked out." }
  }
  if (!Number.isFinite(value)) return { ok: false, message: "You can't divide by zero." }

  const hasUnit = tokens.some((t) => t.kind === 'unit')
  const category = hasUnit ? inferred.category : 'dimensionless'
  return {
    ok: true,
    expression: prettyEquation(tokens),
    value: Math.round(value * 1e10) / 1e10,
    unit: resultUnit(category, tokens),
    category,
    operator: inferOperator(tokens),
  }
}

/** Grouped for reading: `1.000.340,6` in de-DE. */
export function formatNumber(value: number, locale: string): string {
  const rounded = Math.round(value * 1e10) / 1e10
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 10 }).format(
    Object.is(rounded, -0) ? 0 : rounded,
  )
}

/** Ungrouped, in the locale's decimal mark, so it can be typed back in: `1000340,6`. */
export function formatPlain(value: number, locale: string): string {
  const decimal =
    new Intl.NumberFormat(locale).formatToParts(1.5).find((p) => p.type === 'decimal')?.value ?? '.'
  return String(Math.round(value * 1e10) / 1e10).replace('.', decimal === ',' ? ',' : '.')
}

export const withUnit = (number: string, unit: string) => (unit ? `${number} ${unit}` : number)
