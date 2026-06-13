import { PALETTE } from '@/core/constants/palette'
import type { DocStatus } from '@/core/domain/entities'
import type { TranslationKey } from '@/core/constants/i18n'

interface DocStatusView {
  /** Pill label. */
  label2: string
  color: string
  bg: string
  icon: string
}

/** Resolve a document status to its label, palette and icon. */
export function docStatusInfo(status: DocStatus, t: (k: TranslationKey) => string): DocStatusView {
  const map: Record<DocStatus, { key: TranslationKey; palette: keyof typeof PALETTE; icon: string }> = {
    valid: { key: 'docValid', palette: 'green', icon: 'checkCircle' },
    pending: { key: 'docPending', palette: 'amber', icon: 'clock' },
    missing: { key: 'docMissing', palette: 'gray', icon: 'x' },
    rejected: { key: 'docRejected', palette: 'red', icon: 'xCircle' },
  }
  const entry = map[status]
  const palette = PALETTE[entry.palette]
  return { label2: t(entry.key), color: palette.c, bg: palette.b, icon: entry.icon }
}
