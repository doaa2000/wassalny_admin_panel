import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui.store'

/** Resolved chart-relevant colours for the active theme. */
export function useThemeTokens() {
  const ui = useUiStore()
  const { theme } = storeToRefs(ui)

  const tokens = computed(() =>
    theme.value === 'dark'
      ? { grid: 'rgba(148,163,184,.14)', tick: '#B7C2D0', primary: '#FB923C' }
      : { grid: 'rgba(148,163,184,.18)', tick: '#475569', primary: '#F97316' },
  )

  return { theme, tokens }
}
