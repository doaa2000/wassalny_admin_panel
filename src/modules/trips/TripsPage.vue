<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Trip } from '@/core/domain/entities'
import { repositories } from '@/core/di/container'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useI18n } from '@/core/composables/useI18n'
import { useDataTable } from '@/core/composables/useDataTable'
import { SEED_DRIVERS, SEED_PASSENGERS } from '@/core/data/mock/seed'
import { egp } from '@/core/utils/format'
import type { Column } from '@/shared/tables/DataTable.vue'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import DataTable from '@/shared/tables/DataTable.vue'
import AvatarBadge from '@/shared/ui/AvatarBadge.vue'
import StatusPill from '@/shared/ui/StatusPill.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import IconButton from '@/shared/ui/IconButton.vue'
import TripModal from './components/TripModal.vue'

const { t, L } = useI18n()
const repo = repositories().trips
const { data, loading, error, refresh } = useAsyncData(() => repo.list())
const trips = computed(() => data.value ?? [])

const status = ref('all')
const statusOptions = computed(() => [
  { value: 'all', label: t('allStatus') },
  ...(['pending', 'accepted', 'started', 'completed', 'cancelled'] as const).map((s) => ({
    value: s,
    label: t(`st_${s}`),
  })),
])

const filters = computed(() => {
  const predicates: Array<(trip: Trip) => boolean> = []
  if (status.value !== 'all') predicates.push((trip) => trip.status === status.value)
  return predicates
})

const table = useDataTable<Trip>({
  source: trips,
  searchFields: [(trip) => `${trip.id} ${trip.from.en} ${trip.to.en} ${trip.from.ar} ${trip.to.ar}`],
  filters,
  pageSize: 10,
})

const columns: Column[] = [
  { key: 'id', label: t('tripId') },
  { key: 'driver', label: t('driverCol') },
  { key: 'passenger', label: t('passengerCol') },
  { key: 'route', label: `${t('pickup')} → ${t('destination')}` },
  { key: 'price', label: t('priceCol'), sortable: true },
  { key: 'status', label: t('statusCol') },
  { key: 'actions', label: t('actionsCol'), align: 'end' },
]

const driverName = (trip: Trip) => L(SEED_DRIVERS[trip.driver].name)
const passengerName = (trip: Trip) => L(SEED_PASSENGERS[trip.pass].name)
const selected = ref<Trip | null>(null)
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('trips')" :subtitle="t('tripsSub')" />

    <div class="mb-[18px] flex flex-wrap items-center gap-3">
      <div class="min-w-[220px] flex-1"><BaseInput v-model="table.query.value" icon="search" :placeholder="t('search')" /></div>
      <div
        class="flex h-11 items-center gap-2 rounded-[11px] border border-border bg-surface px-3.5 text-[13.5px] font-semibold text-text2"
      >
        <BaseIcon name="calendar" :size="16" /><span>{{ t('dateRange') }}</span>
      </div>
      <BaseSelect v-model="status" :options="statusOptions" />
    </div>

    <DataTable
      :columns="columns"
      :rows="table.paged.value"
      :total="table.total.value"
      :page="table.page.value"
      :page-count="table.pageCount.value"
      :loading="loading"
      :error="error"
      :is-empty="!loading && !error && table.total.value === 0"
      :sort-key="table.sortKey.value as string"
      :sort-dir="table.sortDir.value"
      :min-width="900"
      @update:page="table.page.value = $event"
      @sort="table.toggleSort($event as keyof Trip)"
      @retry="refresh"
    >
      <template #row="{ row }: { row: Trip }">
        <td class="px-5 py-3.5">
          <div class="text-[13.5px] font-extrabold text-primary">{{ row.id }}</div>
          <div class="text-[11.5px] text-muted">{{ row.date }}</div>
        </td>
        <td class="px-4 py-3.5">
          <div class="flex items-center gap-2.5">
            <AvatarBadge :name="SEED_DRIVERS[row.driver].name.en" :size="30" />
            <span class="text-[13.5px] font-semibold">{{ driverName(row) }}</span>
          </div>
        </td>
        <td class="px-4 py-3.5">
          <div class="flex items-center gap-2.5">
            <AvatarBadge :name="SEED_PASSENGERS[row.pass].name.en" :size="30" />
            <span class="text-[13.5px] font-semibold">{{ passengerName(row) }}</span>
          </div>
        </td>
        <td class="px-4 py-3.5 text-[13px] text-text2">
          <div class="flex items-center gap-1.5">
            <span class="h-2 w-2 flex-none rounded-full" style="background: #10b981" />{{ L(row.from) }}
          </div>
          <div class="mt-1 flex items-center gap-1.5">
            <span class="h-2 w-2 flex-none rounded-full" style="background: #ef4444" />{{ L(row.to) }}
          </div>
        </td>
        <td class="px-4 py-3.5 text-sm font-extrabold">{{ egp(row.price) }}</td>
        <td class="px-4 py-3.5"><StatusPill :status="row.status" :label="t(`st_${row.status}`)" /></td>
        <td class="px-5 py-3.5 text-end"><IconButton icon="eye" @click="selected = row" /></td>
      </template>
    </DataTable>

    <TripModal :open="selected !== null" :trip="selected" @close="selected = null" />
  </div>
</template>
