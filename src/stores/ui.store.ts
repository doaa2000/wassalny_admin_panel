import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { DEFAULT_LOCALE, RTL_LOCALES, type Locale } from '@/core/constants/i18n'

export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'wasalny.theme'
const LOCALE_KEY = 'wasalny.locale'

function preferredTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function preferredLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_KEY) as Locale | null
  return stored === 'ar' || stored === 'en' ? stored : DEFAULT_LOCALE
}

/**
 * Global UI state: theme, locale (with RTL handling) and sidebar collapse.
 * Side-effects (document attributes, persistence) are colocated here so the
 * rest of the app simply reads reactive state.
 */
export const useUiStore = defineStore('ui', () => {
  const theme = ref<ThemeMode>(preferredTheme())
  const locale = ref<Locale>(preferredLocale())
  const sidebarCollapsed = ref(false)

  const isRtl = computed(() => RTL_LOCALES.includes(locale.value))
  const direction = computed<'rtl' | 'ltr'>(() => (isRtl.value ? 'rtl' : 'ltr'))

  function applyDocument() {
    const root = document.documentElement
    root.setAttribute('data-theme', theme.value)
    root.setAttribute('dir', direction.value)
    root.setAttribute('lang', locale.value)
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function toggleLocale() {
    locale.value = locale.value === 'en' ? 'ar' : 'en'
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  watch(theme, (value) => {
    localStorage.setItem(THEME_KEY, value)
    applyDocument()
  })
  watch(locale, (value) => {
    localStorage.setItem(LOCALE_KEY, value)
    applyDocument()
  })

  // Apply once on store creation.
  applyDocument()

  return {
    theme,
    locale,
    sidebarCollapsed,
    isRtl,
    direction,
    toggleTheme,
    toggleLocale,
    toggleSidebar,
  }
})
