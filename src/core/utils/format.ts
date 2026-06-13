/** Format an EGP amount with a thousands separator. */
export function egp(amount: number): string {
  return `EGP ${amount.toLocaleString('en-US')}`
}

/** Clamp a number into an inclusive range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Percentage width string (capped at 100%). */
export function percentWidth(used: number, limit: number): string {
  if (limit <= 0) return '0%'
  return `${clamp(Math.round((used / limit) * 100), 0, 100)}%`
}
