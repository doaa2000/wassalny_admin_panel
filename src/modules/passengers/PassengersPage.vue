<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Passenger, PassengerStatus } from '@/core/domain/entities'
import { repositories } from '@/core/di/container'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useI18n } from '@/core/composables/useI18n'
import { useDataTable } from '@/core/composables/useDataTable'
import { PALETTE } from '@/core/constants/palette'
import type { Column } from '@/shared/tables/DataTable.vue'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import DataTable from '@/shared/tables/DataTable.vue'
import AvatarBadge from '@/shared/ui/AvatarBadge.vue'
import StatusPill from '@/shared/ui/StatusPill.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import IconButton from '@/shared/ui/IconButton.vue'
import PassengerModal from './components/PassengerModal.vue'

const { t, L } = useI18n()
const repo = repositories().passengers
const { data, loading, error, refresh } = useAsyncData(() => repo.list())
const passengers = computed(() => data.value ?? [])

const status = ref('all')
const statusOptions = computed(() => [
  { value: 'all', label: t('allStatus') },
  { value: 'active', label: t('st_active') },
  { value: 'suspended', label: t('st_suspended') },
  { value: 'inactive', label: t('st_inactive') },
])

const filters = computed(() => {
  const predicates: Array<(p: Passenger) => boolean> = []
  if (status.value !== 'all') predicates.push((p) => p.status === status.value)
  return predicates
})

const table = useDataTable<Passenger>({
  source: passengers,
  searchFields: [(p) => `${p.name.en} ${p.name.ar} ${p.phone} ${p.id}`],
  filters,
})

const columns: Column[] = [
  { key: 'name', label: t('fullName'), sortable: true },
  { key: 'phone', label: t('phoneNum') },
  { key: 'trips', label: t('tripsCount'), sortable: true },
  { key: 'joined', label: t('regDate') },
  { key: 'status', label: t('statusCol') },
  { key: 'actions', label: t('actionsCol'), align: 'end' },
]

const selected = ref<Passenger | null>(null)

async function toggle(p: Passenger) {
  const next: PassengerStatus = p.status === 'active' ? 'suspended' : 'active'
  const updated = await repo.setStatus(p.id, next)
  if (data.value) data.value = data.value.map((x) => (x.id === p.id ? updated : x))
}
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('passengers')" :subtitle="t('passengersSub')" />

    <div class="mb-[18px] flex flex-wrap items-center gap-3">
      <div class="min-w-[240px] flex-1"><BaseInput v-model="table.query.value" icon="search" :placeholder="t('search')" /></div>
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
      :min-width="760"
      @update:page="table.page.value = $event"
      @sort="table.toggleSort($event as keyof Passenger)"
      @retry="refresh"
    >
      <template #row="{ row }: { row: Passenger }">
        <td class="px-5 py-3.5">
          <div class="flex items-center gap-3">
            <AvatarBadge :name="row.name.en" :size="40" />
            <div>
              <div class="text-sm font-bold">{{ L(row.name) }}</div>
              <div class="text-[12px] text-muted">{{ row.id }}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3.5 text-start text-[13.5px] text-text2" dir="ltr">{{ row.phone }}</td>
        <td class="px-4 py-3.5 text-sm font-bold">{{ row.trips }}</td>
        <td class="px-4 py-3.5 text-[13.5px] text-text2">{{ row.joined }}</td>
        <td class="px-4 py-3.5"><StatusPill :status="row.status" :label="t(`st_${row.status}`)" /></td>
        <td class="px-5 py-3.5">
          <div class="flex items-center justify-end gap-1.5">
            <IconButton icon="eye" :title="t('view')" @click="selected = row" />
            <IconButton icon="trips" @click="selected = row" />
            <IconButton
              :icon="row.status === 'active' ? 'ban' : 'check'"
              :color="row.status !== 'active' ? PALETTE.green.c : undefined"
              @click="toggle(row)"
            />
          </div>
        </td>
      </template>
    </DataTable>

    <PassengerModal :open="selected !== null" :passenger="selected" @close="selected = null" />
  </div>
</template>
