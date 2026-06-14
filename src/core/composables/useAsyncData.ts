import { ref, shallowRef, onMounted, computed, type Ref } from 'vue'

export interface UseAsyncDataResult<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  /** True when the request succeeded but returned no items. */
  isEmpty: Ref<boolean>
  refresh: () => Promise<void>
}

/**
 * Standardises the loading / error / empty lifecycle used by every list screen.
 * Pass a fetcher; the composable runs it on mount and exposes reactive state.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options: { immediate?: boolean; isEmpty?: (value: T) => boolean } = {},
): UseAsyncDataResult<T> {
  const { immediate = true, isEmpty: emptyCheck } = options
  const data = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function refresh(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher()
    } catch (err) {
      // Surface the real backend error (PostgREST / RPC message) to the console
      // so failures are diagnosable instead of hidden behind the generic UI.
      console.error('[useAsyncData] fetch failed:', err)
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      loading.value = false
    }
  }

  const isEmpty = computed(() => {
    if (loading.value || error.value || data.value === null) return false
    if (emptyCheck) return emptyCheck(data.value)
    if (Array.isArray(data.value)) return data.value.length === 0
    return false
  })

  if (immediate) onMounted(refresh)

  return { data, loading, error, isEmpty, refresh }
}
