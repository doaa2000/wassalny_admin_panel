<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { Driver, DriverStatus } from '@/core/domain/entities'
import { useDriversStore } from '@/stores/drivers.store'
import { useI18n } from '@/core/composables/useI18n'
import { useDataTable } from '@/core/composables/useDataTable'
import { PALETTE } from '@/core/constants/palette'
import { VEHICLE_TYPES, CITIES } from '@/core/constants/localized'
import type { Column } from '@/shared/tables/DataTable.vue'
import DataTable from '@/shared/tables/DataTable.vue'
import AvatarBadge from '@/shared/ui/AvatarBadge.vue'
import StatusPill from '@/shared/ui/StatusPill.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import IconButton from '@/shared/ui/IconButton.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import ConfirmModal from '@/shared/modals/ConfirmModal.vue'
import DriverDetailsModal from './components/DriverDetailsModal.vue'
import DriverDocsModal from './components/DriverDocsModal.vue'
import AddDriverWizard from './components/AddDriverWizard.vue'

const { t, L } = useI18n()
const store = useDriversStore()
const { drivers, loading, error } = storeToRefs(store)

onMounted(() => {
  if (drivers.value.length === 0) store.load()
})

// Filters
const status = ref('all')
const city = ref('all')

const statusOptions = computed(() => [
  { value: 'all', label: t('allStatus') },
  { value: 'active', label: t('st_active') },
  { value: 'pending', label: t('pendingReview') },
  { value: 'offline', label: t('st_offline') },
  { value: 'suspended', label: t('st_suspended') },
])
const cityOptions = computed(() => [
  { value: 'all', label: t('allCities') },
  ...Object.keys(CITIES).slice(0, 5).map((k) => ({ value: k, label: L(CITIES[k]) })),
])

const filters = computed(() => {
  const predicates: Array<(d: Driver) => boolean> = []
  if (status.value !== 'all') predicates.push((d) => d.status === status.value)
  if (city.value !== 'all') predicates.push((d) => d.city === city.value)
  return predicates
})

const table = useDataTable<Driver>({
  source: drivers,
  searchFields: [(d) => `${d.name.en} ${d.name.ar} ${d.phone} ${d.id} ${d.vnum}`],
  filters,
  pageSize: 8,
})

const columns: Column[] = [
  { key: 'name', label: t('fullName'), sortable: true },
  { key: 'phone', label: t('phoneNum') },
  { key: 'vehicle', label: t('vehicleType') },
  { key: 'city', label: t('cityCol') },
  { key: 'status', label: t('statusCol') },
  { key: 'joined', label: t('joinDate'), sortable: true },
  { key: 'verification', label: t('verification') },
  { key: 'actions', label: t('actionsCol'), align: 'end' },
]

// Modals
const detailsDriver = ref<Driver | null>(null)
const docsDriver = ref<Driver | null>(null)
const wizardOpen = ref(false)
const confirm = reactive<{
  open: boolean
  driver: Driver | null
  mode: 'suspend' | 'activate' | 'delete'
}>({ open: false, driver: null, mode: 'suspend' })

function askToggle(driver: Driver) {
  confirm.driver = driver
  confirm.mode = driver.status === 'suspended' ? 'activate' : 'suspend'
  confirm.open = true
}
function askDelete(driver: Driver) {
  confirm.driver = driver
  confirm.mode = 'delete'
  confirm.open = true
}
const confirmView = computed(() => {
  const map = {
    suspend: { title: t('confirmSuspend'), sub: t('confirmSuspendSub'), label: t('suspend'), danger: true, icon: 'ban' },
    activate: { title: t('confirmActivate'), sub: t('confirmActivateSub'), label: t('reactivate'), danger: false, icon: 'check' },
    delete: { title: t('confirmDelete'), sub: t('confirmDeleteSub'), label: t('del'), danger: true, icon: 'trash' },
  }
  return map[confirm.mode]
})
async function onConfirm() {
  if (!confirm.driver) return
  if (confirm.mode === 'delete') await store.remove(confirm.driver.id)
  else await store.setStatus(confirm.driver.id, (confirm.mode === 'activate' ? 'active' : 'suspended') as DriverStatus)
  confirm.open = false
}

async function onCreate(driver: Driver) {
  await store.createManual(driver)
  wizardOpen.value = false
}

const verification = (d: Driver) =>
  d.verified
    ? { label: t('verifiedBadge'), color: PALETTE.green.c, bg: PALETTE.green.b, icon: 'shieldCheck' }
    : { label: d.status === 'pending' ? t('pendingReview') : t('unverified'), color: PALETTE.amber.c, bg: PALETTE.amber.b, icon: 'clock' }
</script>

<template>
  <div class="animate-fade">
    <!-- Banner -->
    <div class="mb-[18px] flex items-center gap-3 rounded-[13px] border border-primary-soft2 bg-primary-soft px-4 py-3">
      <BaseIcon name="shield" :size="18" class="flex-none text-primary" />
      <span class="text-[13px] font-semibold text-text2">{{ t('driversBanner') }}</span>
    </div>

    <!-- Toolbar -->
    <div class="mb-[18px] flex flex-wrap items-center gap-3">
      <div class="min-w-[240px] flex-1">
        <BaseInput v-model="table.query.value" icon="search" :placeholder="t('search')" />
      </div>
      <BaseSelect v-model="status" :options="statusOptions" />
      <BaseSelect v-model="city" :options="cityOptions" />
      <BaseButton icon="lock" :title="t('openManualAdd')" @click="wizardOpen = true">{{ t('addDriver') }}</BaseButton>
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
      :empty-icon="'drivers'"
      :empty-title="t('emptyDriversTitle')"
      :empty-body="t('emptyDriversBody')"
      :sort-key="table.sortKey.value as string"
      :sort-dir="table.sortDir.value"
      :min-width="920"
      @update:page="table.page.value = $event"
      @sort="table.toggleSort($event as keyof Driver)"
      @retry="store.load"
    >
      <template #row="{ row }: { row: Driver }">
        <td class="px-5 py-3.5">
          <div class="flex items-center gap-3">
            <AvatarBadge :name="row.name.en" :size="40" />
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-sm font-bold">{{ L(row.name) }}</span>
                <span
                  v-if="row.manual"
                  class="rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-extrabold text-primary"
                >
                  {{ t('addedManually') }}
                </span>
              </div>
              <div class="text-[12px] text-muted">{{ row.id }} · {{ row.vnum }}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3.5 text-start text-[13.5px] text-text2" dir="ltr">{{ row.phone }}</td>
        <td class="px-4 py-3.5 text-[13.5px] text-text2">{{ L(VEHICLE_TYPES[row.vt]) }}</td>
        <td class="px-4 py-3.5 text-[13.5px] text-text2">{{ L(CITIES[row.city]) }}</td>
        <td class="px-4 py-3.5">
          <StatusPill
            :status="row.status === 'pending' ? 'pending' : row.status"
            :label="row.status === 'pending' ? t('pendingReview') : t(`st_${row.status}`)"
          />
        </td>
        <td class="px-4 py-3.5 text-[13px] text-text2">{{ row.joined }}</td>
        <td class="px-4 py-3.5">
          <span
            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold"
            :style="{ color: verification(row).color, background: verification(row).bg }"
          >
            <BaseIcon :name="verification(row).icon" :size="13" />{{ verification(row).label }}
          </span>
        </td>
        <td class="px-5 py-3.5">
          <div class="flex items-center justify-end gap-1.5">
            <IconButton icon="eye" :title="t('view')" @click="detailsDriver = row" />
            <IconButton icon="fileCheck" :title="t('viewDocs')" @click="docsDriver = row" />
            <IconButton icon="edit" :title="t('edit')" @click="detailsDriver = row" />
            <IconButton
              :icon="row.status === 'suspended' ? 'check' : 'ban'"
              :color="row.status === 'suspended' ? PALETTE.green.c : undefined"
              :title="row.status === 'suspended' ? t('reactivate') : t('suspend')"
              @click="askToggle(row)"
            />
            <IconButton icon="trash" :color="PALETTE.red.c" :title="t('del')" @click="askDelete(row)" />
          </div>
        </td>
      </template>
    </DataTable>

    <!-- Modals -->
    <DriverDetailsModal :open="detailsDriver !== null" :driver="detailsDriver" @close="detailsDriver = null" />
    <DriverDocsModal :open="docsDriver !== null" :driver="docsDriver" @close="docsDriver = null" />
    <AddDriverWizard :open="wizardOpen" @close="wizardOpen = false" @create="onCreate" />
    <ConfirmModal
      :open="confirm.open"
      :title="confirmView.title"
      :subtitle="confirmView.sub"
      :confirm-label="confirmView.label"
      :danger="confirmView.danger"
      :icon="confirmView.icon"
      @close="confirm.open = false"
      @confirm="onConfirm"
    />
  </div>
</template>
