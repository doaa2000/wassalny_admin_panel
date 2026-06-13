import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { MESSAGES, type TranslationKey } from '@/core/constants/i18n'
import { localize, type Localized } from '@/core/constants/localized'
import { useUiStore } from '@/stores/ui.store'

/**
 * Translation composable. `t` resolves message keys; `L` resolves a bilingual
 * value (`{ en, ar }`) to the active locale.
 */
export function useI18n() {
  const ui = useUiStore()
  const { locale, isRtl, direction } = storeToRefs(ui)

  const t = (key: TranslationKey): string => MESSAGES[locale.value][key] ?? String(key)
  const L = (value: Localized | string): string => localize(value, locale.value)

  return {
    locale,
    isRtl,
    direction,
    t,
    L,
    /** Reactive helper for templates that want a memoised translator. */
    translator: computed(() => (key: TranslationKey) => MESSAGES[locale.value][key] ?? String(key)),
  }
}
