export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const pluralDays = (days: number) =>
  `${days} ${days === 1 ? "day" : "days"}`;
