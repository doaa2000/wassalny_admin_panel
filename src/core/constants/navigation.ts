import type { TranslationKey } from './i18n'

/** A single navigation entry. `key` maps to a route name and a translation key. */
export interface NavItem {
  key: string
  /** Icon name registered in the icon set. */
  icon: string
  /** Optional badge translation-free literal (e.g. a pending count). */
  badge?: string
}

/** A labelled group of navigation entries. */
export interface NavGroup {
  /** Translation key for the group heading. */
  label: TranslationKey
  items: NavItem[]
}

/** Sidebar information architecture — mirrors the source `NAV` structure. */
export const NAV_GROUPS: NavGroup[] = [
  { label: 'grp_main', items: [{ key: 'dashboard', icon: 'dashboard' }] },
  {
    label: 'grp_people',
    items: [
      { key: 'drivers', icon: 'drivers' },
      { key: 'applications', icon: 'applications', badge: '6' },
      { key: 'flow', icon: 'flow' },
      { key: 'passengers', icon: 'passengers' },
    ],
  },
  {
    label: 'grp_ops',
    items: [
      { key: 'trips', icon: 'trips' },
      { key: 'livemap', icon: 'livemap' },
      { key: 'locations', icon: 'pricing' },
    ],
  },
  {
    label: 'grp_finance',
    items: [
      { key: 'earnings', icon: 'earnings' },
      { key: 'pricing', icon: 'pricing' },
      { key: 'coupons', icon: 'percent' },
    ],
  },
  {
    label: 'grp_engage',
    items: [
      { key: 'notifications', icon: 'bell' },
      { key: 'complaints', icon: 'inbox', badge: '4' },
      { key: 'ratings', icon: 'star' },
    ],
  },
  {
    label: 'grp_system',
    items: [
      { key: 'reports', icon: 'file' },
      { key: 'content', icon: 'file' },
      { key: 'admins', icon: 'shieldCheck' },
      { key: 'audit', icon: 'clock' },
      { key: 'settings', icon: 'settings' },
    ],
  },
]
