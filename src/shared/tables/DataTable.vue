<script setup lang="ts" generic="T">
import { computed } from 'vue'
import TableSkeleton from '@/shared/ui/TableSkeleton.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import ErrorState from '@/shared/ui/ErrorState.vue'
import BasePagination from '@/shared/ui/BasePagination.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import { useI18n } from '@/core/composables/useI18n'

export interface Column {
  key: string
  label: string
  align?: 'start' | 'end'
  sortable?: boolean
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    rows: T[]
    total: number
    page?: number
    pageCount?: number
    minWidth?: number
    loading?: boolean
    error?: Error | null
    isEmpty?: boolean
    emptyTitle?: string
    emptyBody?: string
    emptyIcon?: string
    sortKey?: string | null
    sortDir?: 'asc' | 'desc'
    /** Hide the footer (results + pagination). */
    hideFooter?: boolean
  }>(),
  { page: 1, pageCount: 1, minWidth: 720, loading: false, isEmpty: false, hideFooter: false },
)

const emit = defineEmits<{
  'update:page': [page: number]
  retry: []
  sort: [key: string]
}>()

const { t } = useI18n()
const showTable = computed(() => !props.loading && !props.error && !props.isEmpty)
</script>

<template>
  <TableSkeleton v-if="loading" />

  <div v-else class="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
    <ErrorState v-if="error" @retry="emit('retry')" />

    <EmptyState
      v-else-if="isEmpty"
      :icon="emptyIcon ?? 'inbox'"
      :title="emptyTitle ?? t('noResults')"
      :body="emptyBody ?? t('noResultsSub')"
    />

    <template v-else-if="showTable">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse" :style="{ minWidth: `${minWidth}px` }">
          <thead>
            <tr class="bg-surface2">
              <th
                v-for="col in columns"
                :key="col.key"
                class="px-4 py-3.5 text-[12px] font-extrabold uppercase tracking-wide text-muted first:ps-5 last:pe-5"
                :class="[
                  col.align === 'end' ? 'text-end' : 'text-start',
                  col.sortable ? 'cursor-pointer select-none' : '',
                ]"
                @click="col.sortable && emit('sort', col.key)"
              >
                <span class="inline-flex items-center gap-1">
                  {{ col.label }}
                  <BaseIcon
                    v-if="col.sortable && sortKey === col.key"
                    :name="sortDir === 'asc' ? 'arrowUp' : 'arrowDown'"
                    :size="12"
                  />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="index" class="border-t border-border">
              <slot name="row" :row="row" :index="index" />
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!hideFooter"
        class="flex items-center justify-between border-t border-border px-5 py-3.5 text-[13px] font-semibold text-muted"
      >
        <span>{{ t('showing') }} {{ rows.length }} {{ t('of') }} {{ total }} {{ t('results') }}</span>
        <BasePagination
          v-if="pageCount > 1"
          :page="page"
          :page-count="pageCount"
          @update:page="emit('update:page', $event)"
        />
      </div>
    </template>
  </div>
</template>
