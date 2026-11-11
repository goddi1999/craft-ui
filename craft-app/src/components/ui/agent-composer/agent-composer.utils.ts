export const formatTokens = (n: number) =>
  n < 1000 ? `${n}` : `${(n / 1000).toFixed(n < 100_000 ? 1 : 0)}k`
