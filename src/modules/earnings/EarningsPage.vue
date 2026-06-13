<script setup lang="ts">
import { computed } from 'vue'
import type { ChartConfiguration } from 'chart.js'
import { useI18n } from '@/core/composables/useI18n'
import { useThemeTokens } from '@/core/composables/useThemeTokens'
import { PALETTE } from '@/core/constants/palette'
import { SEED_DRIVERS } from '@/core/data/mock/seed'
import { CITIES } from '@/core/constants/localized'
import { egp } from '@/core/utils/format'
import { avatarColor, initials } from '@/core/utils/avatar'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseChart from '@/shared/charts/BaseChart.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const { t, L } = useI18n()
const { tokens } = useThemeTokens()
const rebuildKey = computed(() => tokens.value.tick)

const stats = computed(() => [
  { value: 'EGP 4.82M', label: t('stat_totalRevenue'), delta: '9.3%', icon: 'wallet', tint: PALETTE.teal },
  { value: 'EGP 964K', label: t('platformCommission'), delta: '7.1%', icon: 'percent', tint: PALETTE.orange },
  { value: 'EGP 3.85M', label: t('driverEarnings'), delta: '8.4%', icon: 'earnings', tint: PALETTE.green },
  { value: 'EGP 168K', label: t('stat_todayRevenue'), delta: '5.1%', icon: 'trending', tint: PALETTE.indigo },
])

const baseScales = () => ({
  x: { grid: { display: false }, ticks: { color: tokens.value.tick, font: { family: 'Tajawal' } } },
  y: { grid: { color: tokens.value.grid }, ticks: { color: tokens.value.tick, font: { family: 'Tajawal' } }, beginAtZero: true },
})

const daily = computed<ChartConfiguration>(() => ({
  type: 'bar',
  data: {
    labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    datasets: [{ data: [120, 145, 132, 168, 190, 210, 175], backgroundColor: tokens.value.primary, borderRadius: 6, barThickness: 18 }],
  },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: baseScales() },
}))
const monthly = computed<ChartConfiguration>(() => ({
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [3.2, 3.6, 3.9, 4.2, 4.5, 4.82], borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,.18)', fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 0 }],
  },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: baseScales() },
}))
const commission = computed<ChartConfiguration>(() => ({
  type: 'doughnut',
  data: {
    labels: [t('platformCommission'), t('driverEarnings')],
    datasets: [{ data: [20, 80], backgroundColor: ['#F97316', '#10B981'], borderWidth: 0 }],
  },
  options: { responsive: true, maintainAspectRatio: false, cutout: '64%', plugins: { legend: { position: 'bottom', labels: { color: tokens.value.tick, usePointStyle: true, pointStyle: 'circle', padding: 12, boxWidth: 8 } } } },
}))

const rows = computed(() =>
  SEED_DRIVERS.filter((d) => d.trips > 0).slice(0, 8).map((d) => {
    const gross = d.trips * 58
    const commissionAmt = Math.round(gross * 0.2)
    return {
      nameEn: d.name.en,
      name: L(d.name),
      city: L(CITIES[d.city]),
      trips: d.trips,
      gross: egp(gross),
      commission: egp(commissionAmt),
      net: egp(gross - commissionAmt),
    }
  }),
)
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('earnings')" :subtitle="t('earnSub')" />

    <div class="mb-[18px] grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
      <BaseCard v-for="s in stats" :key="s.label">
        <div class="mb-3.5 flex items-center justify-between">
          <div class="flex h-11 w-11 items-center justify-center rounded-[13px]" :style="{ background: s.tint.b, color: s.tint.c }">
            <BaseIcon :name="s.icon" :size="22" />
          </div>
          <span class="rounded-full px-2.5 py-1 text-[12.5px] font-extrabold text-success" style="background: rgba(16,185,129,.14)">{{ s.delta }}</span>
        </div>
        <div class="text-[24px] font-black leading-none">{{ s.value }}</div>
        <div class="mt-1.5 text-[13px] font-semibold text-text2">{{ s.label }}</div>
      </BaseCard>
    </div>

    <div class="mb-[18px] grid grid-cols-1 gap-[18px] lg:grid-cols-3">
      <BaseCard><div class="mb-2.5 text-[15px] font-extrabold">{{ t('dailyRevenue') }}</div><div class="h-[220px]"><BaseChart :config="daily" :rebuild-key="rebuildKey" /></div></BaseCard>
      <BaseCard><div class="mb-2.5 text-[15px] font-extrabold">{{ t('monthlyRevenue') }}</div><div class="h-[220px]"><BaseChart :config="monthly" :rebuild-key="rebuildKey" /></div></BaseCard>
      <BaseCard><div class="mb-2.5 text-[15px] font-extrabold">{{ t('commissionAnalytics') }}</div><div class="h-[220px]"><BaseChart :config="commission" :rebuild-key="rebuildKey" /></div></BaseCard>
    </div>

    <BaseCard :padded="false">
      <div class="border-b border-border px-5 py-4 text-[15px] font-extrabold">{{ t('earningsReport') }}</div>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse" style="min-width: 720px">
          <thead>
            <tr class="bg-surface2">
              <th class="px-5 py-3 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('driverCol') }}</th>
              <th class="px-4 py-3 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('tripsCount') }}</th>
              <th class="px-4 py-3 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('grossLabel') }}</th>
              <th class="px-4 py-3 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('commissionLabel') }}</th>
              <th class="px-5 py-3 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('netLabel') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in rows" :key="e.nameEn" class="border-t border-border">
              <td class="px-5 py-3">
                <div class="flex items-center gap-2.5">
                  <div class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full text-[12px] font-extrabold text-white" :style="{ background: avatarColor(e.nameEn) }">{{ initials(e.nameEn) }}</div>
                  <div><div class="text-[13.5px] font-bold">{{ e.name }}</div><div class="text-[11.5px] text-muted">{{ e.city }}</div></div>
                </div>
              </td>
              <td class="px-4 py-3 text-[13.5px] text-text2">{{ e.trips }}</td>
              <td class="px-4 py-3 text-[13.5px] font-semibold">{{ e.gross }}</td>
              <td class="px-4 py-3 text-[13.5px] font-bold text-primary">{{ e.commission }}</td>
              <td class="px-5 py-3 text-[13.5px] font-extrabold text-success">{{ e.net }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>
