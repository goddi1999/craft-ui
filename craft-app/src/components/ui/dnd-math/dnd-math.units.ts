/**
 * The unit registry and the rules for combining units. Pure data and lookups: which symbols
 * exist, which category each belongs to, what `a op b` produces, and which combinations are
 * blocked outright (mixed currencies, temperature arithmetic, length + area, …).
 */

export type UnitCategory =
  | 'dimensionless'
  | 'length'
  | 'area'
  | 'volume'
  | 'capacity'
  | 'mass'
  | 'time'
  | 'money'
  | 'percentage'
  | 'ratio'
  | 'angle'
  | 'temperature'
  | 'count'
  | 'speed'
  | 'density'
  | 'power'
  | 'energy'
  | 'rate'

export type UnitDefinition = {
  readonly symbol: string
  readonly aliases?: readonly string[]
  readonly category: UnitCategory
  /** Reference unit of the quantity; two money units with different bases are different currencies. */
  readonly baseSymbol: string
  /** The glyph shown on chips. */
  readonly displaySymbol: string
}

export type BinaryOperator = '+' | '-' | '*' | '/'

const unit = (
  symbol: string,
  category: UnitCategory,
  baseSymbol: string,
  displaySymbol = symbol,
  aliases?: readonly string[],
): UnitDefinition => ({ symbol, category, baseSymbol, displaySymbol, aliases })

export const UNIT_DEFINITIONS: readonly UnitDefinition[] = [
  unit('mm', 'length', 'm'),
  unit('cm', 'length', 'm'),
  unit('dm', 'length', 'm'),
  unit('m', 'length', 'm'),
  unit('km', 'length', 'm'),
  unit('lfdm', 'length', 'm', 'lfdm', ['lfm']),

  unit('mm2', 'area', 'm2', 'mm²', ['mm²']),
  unit('cm2', 'area', 'm2', 'cm²', ['cm²']),
  unit('dm2', 'area', 'm2', 'dm²', ['dm²']),
  unit('m2', 'area', 'm2', 'm²', ['m²']),
  unit('a', 'area', 'm2'),
  unit('ha', 'area', 'm2'),
  unit('km2', 'area', 'm2', 'km²', ['km²']),

  unit('mm3', 'volume', 'm3', 'mm³', ['mm³']),
  unit('cm3', 'volume', 'm3', 'cm³', ['cm³']),
  unit('dm3', 'volume', 'm3', 'dm³', ['dm³']),
  unit('m3', 'volume', 'm3', 'm³', ['m³']),

  unit('ml', 'capacity', 'l'),
  unit('cl', 'capacity', 'l'),
  unit('dl', 'capacity', 'l'),
  unit('l', 'capacity', 'l'),

  unit('mg', 'mass', 'kg'),
  unit('g', 'mass', 'kg'),
  unit('kg', 'mass', 'kg'),
  unit('tonne', 'mass', 'kg', 't', ['t']),

  unit('s', 'time', 's'),
  unit('min', 'time', 's'),
  unit('h', 'time', 's'),
  unit('d', 'time', 's'),
  unit('week', 'time', 's', 'Wo', ['Woche', 'Wo']),
  unit('month', 'time', 's', 'Mon', ['Monat', 'Mo']),

  unit('J', 'energy', 'J'),
  unit('kJ', 'energy', 'J'),
  unit('MJ', 'energy', 'J'),
  unit('Wh', 'energy', 'J'),
  unit('kWh', 'energy', 'J'),

  unit('W', 'power', 'W'),
  unit('kW', 'power', 'W'),

  unit('celsius', 'temperature', 'K', '°C', ['°C', 'degC']),
  unit('K', 'temperature', 'K'),

  unit('EUR', 'money', 'EUR', '€', ['€']),
  unit('ct', 'money', 'EUR', 'ct', ['cent']),
  unit('USD', 'money', 'USD', '$', ['$']),

  unit('percent', 'percentage', 'number', '%', ['%']),
  unit('permille', 'percentage', 'number', '‰', ['‰']),

  unit('deg', 'angle', 'rad', '°', ['°']),
  unit('rad', 'angle', 'rad'),

  unit('km/h', 'speed', 'm/s'),
  unit('m/s', 'speed', 'm/s'),

  unit('kg/m3', 'density', 'kg/m3', 'kg/m³', ['kg/m³']),
  unit('g/cm3', 'density', 'kg/m3', 'g/cm³', ['g/cm³']),

  unit('Stueck', 'count', 'Stueck', 'Stück', ['Stück', 'stk', 'Stk', 'STK']),
  unit('Paar', 'count', 'Stueck', 'Paar', ['paar']),
  unit('Einheit', 'count', 'Stueck', 'Einheit', ['Einh', 'LE']),
  unit('Dutzend', 'count', 'Stueck'),

  unit('ratio', 'ratio', 'number', 'η', ['η', 'phi']),

  unit('EUR/kg', 'rate', 'EUR/kg', '€/kg', ['€/kg']),
  unit('EUR/m2', 'rate', 'EUR/m2', '€/m²', ['€/m²']),
  unit('EUR/kWh', 'rate', 'EUR/kWh', '€/kWh', ['€/kWh']),
  unit('EUR/lfdm', 'rate', 'EUR/m', '€/lfdm', ['€/lfdm']),
  unit('EUR/Stueck', 'rate', 'EUR/Stueck', '€/Stück', ['€/Stück', '€/Stk', 'EUR/stk']),
  unit('EUR/h', 'rate', 'EUR/h', '€/h', ['€/h']),
  unit('EUR/t', 'rate', 'EUR/kg', '€/t', ['€/t']),
  unit('EUR/l', 'rate', 'EUR/l', '€/l', ['€/l']),
  unit('EUR/m', 'rate', 'EUR/m', '€/m', ['€/m']),
  unit('EUR/km', 'rate', 'EUR/m', '€/km', ['€/km']),
  unit('EUR/min', 'rate', 'EUR/s', '€/min', ['€/min']),
]

const SUPERSCRIPTS: Record<string, string> = { '²': '2', '³': '3' }
const normalizeSuperscripts = (raw: string) => raw.replace(/[²³]/g, (c) => SUPERSCRIPTS[c] ?? c)

const UNIT_BY_KEY = new Map<string, UnitDefinition>()
for (const def of UNIT_DEFINITIONS) {
  for (const key of [def.symbol, def.displaySymbol, ...(def.aliases ?? [])]) {
    UNIT_BY_KEY.set(key, def)
    UNIT_BY_KEY.set(normalizeSuperscripts(key), def)
  }
}

/** Every spelling a unit can be typed in, longest first so `kWh` wins over `kW`. */
export const UNIT_KEYS: readonly string[] = [...UNIT_BY_KEY.keys()].sort(
  (a, b) => b.length - a.length,
)

/** A unit by symbol, alias or display glyph (`€`, `EUR`, `m²`, `m2`). */
export function findUnit(raw: string): UnitDefinition | null {
  const key = raw.trim()
  if (key.length === 0) return null
  return UNIT_BY_KEY.get(key) ?? UNIT_BY_KEY.get(normalizeSuperscripts(key)) ?? null
}

/** [left, operator, right, result]. `a ± a → a` is always allowed and not listed. */
type BinaryRule = readonly [UnitCategory, BinaryOperator, UnitCategory, UnitCategory]

/** Quantities a plain number can scale (`3 × 4 m`, `450 h ÷ 15`). */
const SCALABLE: readonly UnitCategory[] = [
  'money',
  'length',
  'area',
  'volume',
  'capacity',
  'mass',
  'time',
  'count',
  'power',
  'energy',
]

/** Quantities a ratio (η, 0.8) can scale. */
const RATIO_SCALABLE: readonly UnitCategory[] = [
  'money',
  'mass',
  'length',
  'area',
  'count',
  'power',
  'energy',
]

/** Quantities a price rate (€/kg, €/h, …) multiplies into money. */
const PRICED: readonly UnitCategory[] = [
  'mass',
  'area',
  'capacity',
  'energy',
  'length',
  'time',
  'count',
  'volume',
]

const both = (a: UnitCategory, op: BinaryOperator, b: UnitCategory, r: UnitCategory) =>
  [
    [a, op, b, r],
    [b, op, a, r],
  ] as const

export const BINARY_RULES: readonly BinaryRule[] = [
  ['dimensionless', '*', 'dimensionless', 'dimensionless'],
  ['dimensionless', '/', 'dimensionless', 'dimensionless'],

  // geometry: 4 m × 3 m → 12 m², 12 m³ ÷ 4 m² → 3 m
  ['length', '*', 'length', 'area'],
  ...both('area', '*', 'length', 'volume'),
  ['area', '/', 'length', 'length'],
  ['volume', '/', 'length', 'area'],
  ['volume', '/', 'area', 'length'],

  // density: 8 kg ÷ 2 m³ → 4 kg/m³
  ['mass', '/', 'volume', 'density'],
  ['mass', '/', 'capacity', 'density'],
  ...both('density', '*', 'volume', 'mass'),
  ['density', '*', 'capacity', 'mass'],
  ['mass', '/', 'density', 'volume'],

  // motion: 120 km ÷ 2 h → 60 km/h
  ['length', '/', 'time', 'speed'],
  ...both('speed', '*', 'time', 'length'),

  // energy: 5 kW × 3 h → 15 kWh
  ...both('power', '*', 'time', 'energy'),
  ['energy', '/', 'time', 'power'],

  // capacity and volume add as volume: 500 ml + 0.5 m³
  ...both('capacity', '+', 'volume', 'volume'),

  // price: 540 € ÷ 90 kg → 6 €/kg, 6 €/kg × 90 kg → 540 €
  ...PRICED.map((q) => ['money', '/', q, 'rate'] as const),
  ...PRICED.flatMap((q) => both('rate', '*', q, 'money')),
  ['count', '/', 'time', 'rate'],

  // scaling by a plain number: 40 × 8.50 € → 340 €, 450 h ÷ 15 → 30 h
  ...SCALABLE.flatMap((q) => both('dimensionless', '*', q, q)),
  ...SCALABLE.map((q) => [q, '/', 'dimensionless', q] as const),

  // percentages: 400 € × 24 % → 96 €
  ...both('money', '*', 'percentage', 'money'),
  ...both('dimensionless', '*', 'percentage', 'dimensionless'),

  // ratios: 500 kg × η → 400 kg
  ...RATIO_SCALABLE.flatMap((q) => both(q, '*', 'ratio', q)),
]

/** The category `left op right` produces, or `null` when the combination has no rule. */
export function applyBinaryRule(
  left: UnitCategory,
  operator: BinaryOperator,
  right: UnitCategory,
): UnitCategory | null {
  if (left === right && (operator === '+' || operator === '-')) return left
  const rule = BINARY_RULES.find((r) => r[0] === left && r[1] === operator && r[2] === right)
  return rule ? rule[3] : null
}

type BlockRule = {
  operators: readonly BinaryOperator[]
  /** Category pair the rule applies to, in either order. */
  pair?: readonly [UnitCategory, UnitCategory]
  when?: (left: UnitDefinition, right: UnitDefinition) => boolean
  message: (left: UnitDefinition, right: UnitDefinition) => string
}

const ADD_SUB: readonly BinaryOperator[] = ['+', '-']
const MONEY_QUANTITIES: readonly UnitCategory[] = [
  'length',
  'area',
  'volume',
  'capacity',
  'mass',
  'time',
  'count',
]

const addSubBlock = (a: UnitCategory, b: UnitCategory, what: string): BlockRule => ({
  operators: ADD_SUB,
  pair: [a, b],
  message: () => `${what} can't be added or subtracted.`,
})

/** Hard blocks checked before the rules, so a category match can't sneak them through. */
const BLOCK_RULES: readonly BlockRule[] = [
  {
    operators: ADD_SUB,
    pair: ['money', 'money'],
    when: (l, r) => l.baseSymbol !== r.baseSymbol,
    message: (l, r) =>
      `${l.displaySymbol} and ${r.displaySymbol} are different currencies. Convert one first.`,
  },
  {
    operators: ['*', '/'],
    pair: ['money', 'money'],
    message: () => "Money can't be multiplied or divided by money.",
  },
  {
    operators: ['+', '-', '*', '/'],
    when: (l, r) => l.category === 'temperature' || r.category === 'temperature',
    message: () => "Temperatures (°C, K) can't be used in arithmetic here.",
  },
  addSubBlock('length', 'area', 'A length and an area'),
  addSubBlock('length', 'volume', 'A length and a volume'),
  addSubBlock('area', 'volume', 'An area and a volume'),
  addSubBlock('mass', 'capacity', 'A mass and a liquid amount'),
  addSubBlock('time', 'mass', 'A time and a mass'),
  addSubBlock('money', 'energy', 'Money and energy'),
  {
    operators: ADD_SUB,
    when: (l, r) =>
      (l.category === 'money' && MONEY_QUANTITIES.includes(r.category)) ||
      (r.category === 'money' && MONEY_QUANTITIES.includes(l.category)),
    message: () => "Money can't be added to a quantity like a length, mass, time or count.",
  },
  {
    operators: ADD_SUB,
    pair: ['rate', 'rate'],
    when: (l, r) => l.baseSymbol !== r.baseSymbol,
    message: (l, r) => `${l.displaySymbol} and ${r.displaySymbol} are different prices.`,
  },
]

const matchesPair = (rule: BlockRule, l: UnitDefinition, r: UnitDefinition) => {
  if (!rule.pair) return true
  const [a, b] = rule.pair
  return (l.category === a && r.category === b) || (l.category === b && r.category === a)
}

/** The block message for `left op right`, or `null` when it isn't blocked. */
export function blockedMessage(
  left: UnitDefinition,
  operator: BinaryOperator,
  right: UnitDefinition,
): string | null {
  const rule = BLOCK_RULES.find(
    (r) =>
      r.operators.includes(operator) &&
      matchesPair(r, left, right) &&
      (!r.when || r.when(left, right)),
  )
  return rule ? rule.message(left, right) : null
}

/** A stand-in unit so a plain number can go through the block check. */
export const categoryOnly = (category: UnitCategory): UnitDefinition =>
  unit(category, category, category)
