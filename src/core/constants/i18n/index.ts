import { en, type TranslationKey } from './en'
import { ar } from './ar'

export type Locale = 'en' | 'ar'

/** All translation dictionaries keyed by locale. */
export const MESSAGES: Record<Locale, Record<TranslationKey, string>> = { en, ar }

export type { TranslationKey }

/** Locales that render right-to-left. */
export const RTL_LOCALES: Locale[] = ['ar']

export const DEFAULT_LOCALE: Locale = 'en'
