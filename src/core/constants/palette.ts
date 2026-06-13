/**
 * Fixed colour palette + status → colour mapping.
 * These are theme-independent accent colours used for pills, charts and avatars.
 * Lifted directly from the source design (PAL / STATUS_PAL / AVA).
 */

export interface PaletteEntry {
  /** Foreground / solid colour. */
  c: string
  /** Translucent background colour. */
  b: string
}

export const PALETTE = {
  green: { c: '#10B981', b: 'rgba(16,185,129,.14)' },
  red: { c: '#EF4444', b: 'rgba(239,68,68,.14)' },
  amber: { c: '#F59E0B', b: 'rgba(245,158,11,.16)' },
  blue: { c: '#3B82F6', b: 'rgba(59,130,246,.14)' },
  indigo: { c: '#6366F1', b: 'rgba(99,102,241,.14)' },
  gray: { c: '#94A3B8', b: 'rgba(148,163,184,.16)' },
  orange: { c: '#F97316', b: 'rgba(249,115,22,.14)' },
  violet: { c: '#8B5CF6', b: 'rgba(139,92,246,.14)' },
  teal: { c: '#14B8A6', b: 'rgba(20,184,166,.14)' },
  pink: { c: '#EC4899', b: 'rgba(236,72,153,.14)' },
} as const

export type PaletteKey = keyof typeof PALETTE

/** Maps a domain status/priority to a palette key. */
export const STATUS_PALETTE: Record<string, PaletteKey> = {
  active: 'green',
  online: 'green',
  completed: 'green',
  approved: 'green',
  resolved: 'green',
  available: 'green',
  verified: 'green',
  pending: 'amber',
  open: 'amber',
  review: 'amber',
  medium: 'amber',
  started: 'blue',
  inprogress: 'blue',
  accepted: 'indigo',
  suspended: 'red',
  cancelled: 'red',
  rejected: 'red',
  high: 'red',
  urgent: 'red',
  closed: 'gray',
  offline: 'gray',
  inactive: 'gray',
  low: 'gray',
}

/** Deterministic avatar background colours. */
export const AVATAR_COLORS = [
  '#F97316',
  '#6366F1',
  '#10B981',
  '#EC4899',
  '#3B82F6',
  '#8B5CF6',
  '#14B8A6',
  '#F59E0B',
] as const

export function paletteFor(key: PaletteKey): PaletteEntry {
  return PALETTE[key]
}

/** Resolve a status string to its palette entry. */
export function statusPalette(status: string): PaletteEntry {
  return PALETTE[STATUS_PALETTE[status] ?? 'gray']
}
