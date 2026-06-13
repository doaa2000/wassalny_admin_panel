import type { Locale } from './i18n'

/** A value translated into each supported locale. */
export type Localized = Record<Locale, string>

/** Resolve a localized value (or pass through a plain string). */
export function localize(value: Localized | string, locale: Locale): string {
  if (typeof value === 'string') return value
  return value[locale] ?? value.en
}

/** Vehicle types (bilingual). */
export const VEHICLE_TYPES: Record<string, Localized> = {
  economy: { en: 'Economy', ar: 'اقتصادي' },
  comfort: { en: 'Comfort', ar: 'مريح' },
  premium: { en: 'Premium', ar: 'مميز' },
  van: { en: 'Van', ar: 'فان' },
  bike: { en: 'Bike', ar: 'دراجة' },
}

/** Cities (bilingual). */
export const CITIES: Record<string, Localized> = {
  cairo: { en: 'Cairo', ar: 'القاهرة' },
  giza: { en: 'Giza', ar: 'الجيزة' },
  alex: { en: 'Alexandria', ar: 'الإسكندرية' },
  mansoura: { en: 'Mansoura', ar: 'المنصورة' },
  aswan: { en: 'Aswan', ar: 'أسوان' },
  luxor: { en: 'Luxor', ar: 'الأقصر' },
  tanta: { en: 'Tanta', ar: 'طنطا' },
  portsaid: { en: 'Port Said', ar: 'بورسعيد' },
}
