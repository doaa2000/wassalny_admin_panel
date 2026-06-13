import type { Localized } from './localized'

export type DocKind = 'id' | 'license' | 'paper' | 'portrait' | 'vehicle'

export interface DocType {
  key: string
  label: Localized
  kind: DocKind
  optional?: boolean
}

/** Required onboarding documents (mirrors the source `DOC_TYPES`). */
export const DOC_TYPES: DocType[] = [
  { key: 'nid', label: { en: 'National ID', ar: 'الرقم القومي' }, kind: 'id' },
  { key: 'license', label: { en: 'Driver License', ar: 'رخصة القيادة' }, kind: 'license' },
  { key: 'vehReg', label: { en: 'Vehicle Registration', ar: 'رخصة المركبة' }, kind: 'paper' },
  { key: 'photo', label: { en: 'Driver Photo', ar: 'صورة السائق' }, kind: 'portrait' },
  { key: 'vehPhoto', label: { en: 'Vehicle Photos', ar: 'صور المركبة' }, kind: 'vehicle', optional: true },
]

export function docTypeOf(key: string): DocType {
  return DOC_TYPES.find((d) => d.key === key) ?? { key, label: { en: key, ar: key }, kind: 'paper' }
}
