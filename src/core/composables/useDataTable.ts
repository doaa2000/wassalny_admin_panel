import { computed, ref, watch, type Ref } from 'vue'

export interface DataTableOptions<T> {
  /** Reactive source rows. */
  source: Ref<T[]>
  /** Fields searched by the free-text query. */
  searchFields?: (keyof T | ((row: T) => string))[]
  /** Page size (defaults to 8). */
  pageSize?: number
  /** Predicate filters keyed by an id; each returns true to keep the row. */
  filters?: Ref<Array<(row: T) => boolean>>
}

/**
 * Client-side table engine: search + multi-filter + sort + pagination.
 * Returns reactive slices and controls consumed by the table components.
 */
export function useDataTable<T extends object>(options: DataTableOptions<T>) {
  const { source, searchFields = [], pageSize = 8, filters } = options

  const query = ref('')
  const page = ref(1)
  const sortKey = ref<keyof T | null>(null)
  const sortDir = ref<'asc' | 'desc'>('asc')

  function matchesQuery(row: T): boolean {
    if (!query.value) return true
    const needle = query.value.toLowerCase()
    return searchFields.some((field) => {
      const value = typeof field === 'function' ? field(row) : String(row[field] ?? '')
      return value.toLowerCase().includes(needle)
    })
  }

  const filtered = computed(() => {
    let rows = source.value.filter(matchesQuery)
    if (filters?.value) {
      for (const predicate of filters.value) rows = rows.filter(predicate)
    }
    if (sortKey.value) {
      const key = sortKey.value as string
      rows = [...rows].sort((a, b) => {
        const av = (a as Record<string, number | string>)[key]
        const bv = (b as Record<string, number | string>)[key]
        if (av === bv) return 0
        const order = av > bv ? 1 : -1
        return sortDir.value === 'asc' ? order : -order
      })
    }
    return rows
  })

  const total = computed(() => filtered.value.length)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))
  const paged = computed(() => {
    const start = (page.value - 1) * pageSize
    return filtered.value.slice(start, start + pageSize)
  })

  function toggleSort(key: keyof T) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDir.value = 'asc'
    }
  }

  // Reset to first page when the result set shrinks below the current page.
  watch([query, filtered], () => {
    if (page.value > pageCount.value) page.value = 1
  })

  return { query, page, pageCount, total, paged, filtered, sortKey, sortDir, toggleSort }
}
