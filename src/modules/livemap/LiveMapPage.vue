<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/core/composables/useI18n'
import { PALETTE } from '@/core/constants/palette'
import { SEED_DRIVERS } from '@/core/data/mock/seed'
import { VEHICLE_TYPES, CITIES } from '@/core/constants/localized'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import AvatarBadge from '@/shared/ui/AvatarBadge.vue'

const { t, L } = useI18n()

const markers = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({
    top: `${15 + ((i * 53) % 70)}%`,
    left: `${10 + ((i * 37) % 78)}%`,
    color: [PALETTE.green.c, PALETTE.blue.c, PALETTE.amber.c][i % 3],
    glow: [PALETTE.green.b, PALETTE.blue.b, PALETTE.amber.b][i % 3],
    delay: `${(i % 5) * 0.3}s`,
  })),
)

const liveStats = computed(() => [
  { value: '1,932', label: t('onlineDrivers'), color: PALETTE.green.c, bg: PALETTE.green.b, icon: 'drivers' },
  { value: '438', label: t('activeTrips'), color: PALETTE.blue.c, bg: PALETTE.blue.b, icon: 'trips' },
  { value: '67', label: t('pickupRequests'), color: PALETTE.amber.c, bg: PALETTE.amber.b, icon: 'mapPin' },
])

const onlineDrivers = computed(() =>
  SEED_DRIVERS.filter((d) => d.status === 'active').map((d, i) => ({
    name: L(d.name),
    nameEn: d.name.en,
    vehicle: L(VEHICLE_TYPES[d.vt]),
    city: L(CITIES[d.city]),
    eta: `${3 + (i % 6)} ${t('etaLabel') === 'ETA' ? 'min' : 'د'}`,
  })),
)
</script>

<template>
  <div class="grid h-[calc(100vh-200px)] min-h-[520px] animate-fade grid-cols-1 gap-[18px] lg:grid-cols-[1fr_320px]">
    <!-- Map -->
    <div class="relative overflow-hidden rounded-2xl border border-border bg-surface2 shadow-card">
      <div
        class="absolute inset-0 opacity-50"
        style="
          background-image: linear-gradient(var(--c-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--c-border) 1px, transparent 1px);
          background-size: 48px 48px;
        "
      />
      <div
        v-for="(mk, i) in markers"
        :key="i"
        class="absolute -translate-x-1/2 -translate-y-1/2"
        :style="{ top: mk.top, left: mk.left }"
      >
        <div
          class="absolute -inset-2 animate-pulseDot rounded-full"
          :style="{ background: mk.glow, animationDelay: mk.delay }"
        />
        <div
          class="relative h-[18px] w-[18px] rounded-full border-[3px] border-white shadow"
          :style="{ background: mk.color }"
        />
      </div>
      <!-- Legend -->
      <div
        class="absolute bottom-4 flex gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[12px] font-bold shadow-card ltr:left-4 rtl:right-4"
      >
        <span class="flex items-center gap-1.5 text-text2"><span class="h-[9px] w-[9px] rounded-full" style="background:#10b981" />{{ t('st_online') }}</span>
        <span class="flex items-center gap-1.5 text-text2"><span class="h-[9px] w-[9px] rounded-full" style="background:#3b82f6" />{{ t('activeTrips') }}</span>
        <span class="flex items-center gap-1.5 text-text2"><span class="h-[9px] w-[9px] rounded-full" style="background:#f59e0b" />{{ t('pickupRequests') }}</span>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="flex min-h-0 flex-col gap-3.5">
      <div
        v-for="s in liveStats"
        :key="s.label"
        class="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 shadow-card"
      >
        <div
          class="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px]"
          :style="{ background: s.bg, color: s.color }"
        >
          <BaseIcon :name="s.icon" :size="20" />
        </div>
        <div>
          <div class="text-[21px] font-black leading-none">{{ s.value }}</div>
          <div class="mt-0.5 text-[12.5px] font-semibold text-text2">{{ s.label }}</div>
        </div>
        <span class="ms-auto h-2 w-2 animate-pulseDot rounded-full" :style="{ background: s.color }" />
      </div>

      <BaseCard :padded="false" class="flex min-h-0 flex-1 flex-col">
        <div class="flex-none border-b border-border px-4 py-3 text-sm font-extrabold">{{ t('onlineDrivers') }}</div>
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="d in onlineDrivers"
            :key="d.nameEn"
            class="flex cursor-pointer items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-surface2"
          >
            <AvatarBadge :name="d.nameEn" :size="38" online />
            <div class="min-w-0 flex-1">
              <div class="text-[13px] font-bold">{{ d.name }}</div>
              <div class="text-[11.5px] text-muted">{{ d.vehicle }} · {{ d.city }}</div>
            </div>
            <div class="flex-none text-end">
              <div class="text-[11px] font-semibold text-muted">{{ t('etaLabel') }}</div>
              <div class="text-[12.5px] font-extrabold text-primary">{{ d.eta }}</div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
