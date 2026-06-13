<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/core/composables/useI18n'
import { statusPalette, PALETTE } from '@/core/constants/palette'
import { SEED_DRIVERS, SEED_TRIPS, SEED_COMPLAINTS } from '@/core/data/mock/seed'
import { CITIES, VEHICLE_TYPES } from '@/core/constants/localized'
import { egp } from '@/core/utils/format'
import BaseCard from '@/shared/ui/BaseCard.vue'
import AvatarBadge from '@/shared/ui/AvatarBadge.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const { t, L } = useI18n()
const router = useRouter()

const latestTrips = computed(() =>
  SEED_TRIPS.slice(0, 4).map((trip) => {
    const palette = statusPalette(trip.status)
    return {
      id: trip.id,
      route: `${L(trip.from)} → ${L(trip.to)}`,
      driver: L(SEED_DRIVERS[trip.driver].name),
      price: egp(trip.price),
      statusLabel: t(`st_${trip.status}`),
      statusColor: palette.c,
    }
  }),
)

const newDrivers = computed(() =>
  SEED_DRIVERS.slice(0, 4).map((driver) => {
    const palette = statusPalette(driver.status)
    return {
      name: L(driver.name),
      nameEn: driver.name.en,
      vehicle: L(VEHICLE_TYPES[driver.vt]),
      city: L(CITIES[driver.city]),
      statusLabel: t(`st_${driver.status}`),
      statusColor: palette.c,
      statusBg: palette.b,
    }
  }),
)

const complaints = computed(() =>
  SEED_COMPLAINTS.slice(0, 4).map((complaint) => {
    const palette = statusPalette(complaint.priority)
    return {
      id: complaint.id,
      type: L(complaint.type),
      user: L(complaint.user),
      priority: t(`pr_${complaint.priority}`),
      color: palette.c,
    }
  }),
)
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[18px]">
    <!-- Latest trips -->
    <BaseCard :padded="false">
      <div class="flex items-center justify-between border-b border-border px-5 py-4">
        <span class="text-[15px] font-extrabold">{{ t('latestTrips') }}</span>
        <span class="cursor-pointer text-[12.5px] font-bold text-primary" @click="router.push({ name: 'trips' })">
          {{ t('viewAll') }}
        </span>
      </div>
      <div
        v-for="r in latestTrips"
        :key="r.id"
        class="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-b-0"
      >
        <div
          class="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-primary-soft text-primary"
        >
          <BaseIcon name="trips" :size="18" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-bold">{{ r.route }}</div>
          <div class="text-[12px] text-muted">{{ r.id }} · {{ r.driver }}</div>
        </div>
        <div class="flex-none text-end">
          <div class="text-[13.5px] font-extrabold">{{ r.price }}</div>
          <div class="text-[11px] font-bold" :style="{ color: r.statusColor }">{{ r.statusLabel }}</div>
        </div>
      </div>
    </BaseCard>

    <!-- New drivers -->
    <BaseCard :padded="false">
      <div class="flex items-center justify-between border-b border-border px-5 py-4">
        <span class="text-[15px] font-extrabold">{{ t('newDrivers') }}</span>
        <span
          class="cursor-pointer text-[12.5px] font-bold text-primary"
          @click="router.push({ name: 'applications' })"
        >
          {{ t('viewAll') }}
        </span>
      </div>
      <div
        v-for="r in newDrivers"
        :key="r.nameEn"
        class="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-b-0"
      >
        <AvatarBadge :name="r.nameEn" :size="38" />
        <div class="min-w-0 flex-1">
          <div class="text-[13.5px] font-bold">{{ r.name }}</div>
          <div class="text-[12px] text-muted">{{ r.vehicle }} · {{ r.city }}</div>
        </div>
        <span
          class="flex-none rounded-full px-2.5 py-1 text-[11.5px] font-bold"
          :style="{ color: r.statusColor, background: r.statusBg }"
        >
          {{ r.statusLabel }}
        </span>
      </div>
    </BaseCard>

    <!-- Complaints -->
    <BaseCard :padded="false">
      <div class="flex items-center justify-between border-b border-border px-5 py-4">
        <span class="text-[15px] font-extrabold">{{ t('recentComplaints') }}</span>
        <span
          class="cursor-pointer text-[12.5px] font-bold text-primary"
          @click="router.push({ name: 'complaints' })"
        >
          {{ t('viewAll') }}
        </span>
      </div>
      <div
        v-for="r in complaints"
        :key="r.id"
        class="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-b-0"
      >
        <div
          class="flex h-9 w-9 flex-none items-center justify-center rounded-[10px]"
          :style="{ background: PALETTE.gray.b, color: r.color }"
        >
          <BaseIcon name="complaints" :size="18" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-bold">{{ r.type }}</div>
          <div class="text-[12px] text-muted">{{ r.id }} · {{ r.user }}</div>
        </div>
        <div class="flex-none text-[11.5px] font-bold" :style="{ color: r.color }">{{ r.priority }}</div>
      </div>
    </BaseCard>
  </div>
</template>
