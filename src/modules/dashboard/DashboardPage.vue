<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/core/composables/useI18n'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { repositories } from '@/core/di/container'
import type { TranslationKey } from '@/core/constants/i18n'
import { useDashboardCharts } from './useDashboardCharts'
import StatCard from './components/StatCard.vue'
import DashboardLists from './components/DashboardLists.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import BaseChart from '@/shared/charts/BaseChart.vue'

const { t } = useI18n()
const charts = useDashboardCharts()
const { data: stats } = useAsyncData(() => repositories().dashboard.stats())

const statCards = computed(() =>
  (stats.value ?? []).map((s) => ({
    statKey: s.key,
    icon: s.icon,
    value: s.value,
    delta: s.delta,
    up: s.up,
    palette: s.palette,
    label: t(`stat_${s.key}` as TranslationKey),
  })),
)
</script>

<template>
  <div class="animate-fade">
    <!-- Header -->
    <div class="mb-[22px] flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="m-0 whitespace-nowrap text-[28px] font-black tracking-tight">{{ t('dashGreeting') }}</h1>
        <p class="mt-1.5 text-[14.5px] text-text2">{{ t('dashSub') }}</p>
      </div>
      <div class="flex gap-2.5">
        <div
          class="flex h-[42px] items-center gap-2 rounded-[11px] border border-border bg-surface px-[15px] text-[13.5px] font-bold text-text2"
        >
          <BaseIcon name="calendar" :size="16" />
          <span>{{ t('last30') }}</span>
          <BaseIcon name="chevDown" :size="16" />
        </div>
        <BaseButton icon="download">{{ t('export') }}</BaseButton>
      </div>
    </div>

    <!-- Stats -->
    <div class="mb-[22px] grid grid-cols-[repeat(auto-fit,minmax(228px,1fr))] gap-[18px]">
      <StatCard
        v-for="s in statCards"
        :key="s.statKey"
        :icon="s.icon"
        :value="s.value"
        :label="s.label"
        :delta="s.delta"
        :up="s.up"
        :palette="s.palette"
      />
    </div>

    <!-- Charts row 1 -->
    <div class="mb-[18px] grid grid-cols-1 gap-[18px] lg:grid-cols-[1.5fr_1fr]">
      <BaseCard>
        <div class="mb-1.5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="whitespace-nowrap text-base font-extrabold">{{ t('tripsTrend') }}</div>
            <div class="mt-0.5 text-[12.5px] text-muted">{{ t('last14') }}</div>
          </div>
          <div class="flex gap-3.5 text-[12px] font-bold">
            <span class="flex items-center gap-1.5 text-text2">
              <span class="h-[9px] w-[9px] rounded-[3px] bg-primary" />{{ t('completed') }}
            </span>
            <span class="flex items-center gap-1.5 text-text2">
              <span class="h-[9px] w-[9px] rounded-[3px]" style="background: #94a3b8" />{{ t('cancelled') }}
            </span>
          </div>
        </div>
        <div class="mt-2 h-[280px]"><BaseChart :config="charts.trips.value" :rebuild-key="charts.rebuildKey.value" /></div>
      </BaseCard>
      <BaseCard>
        <div class="text-base font-extrabold">{{ t('tripsByCity') }}</div>
        <div class="mt-0.5 text-[12.5px] text-muted">{{ t('thisMonth') }}</div>
        <div class="mt-2 h-[280px]"><BaseChart :config="charts.city.value" :rebuild-key="charts.rebuildKey.value" /></div>
      </BaseCard>
    </div>

    <!-- Charts row 2 -->
    <div class="mb-[18px] grid grid-cols-1 gap-[18px] lg:grid-cols-2">
      <BaseCard>
        <div class="text-base font-extrabold">{{ t('revenueTrend') }}</div>
        <div class="mt-0.5 text-[12.5px] text-muted">{{ t('egpThousands') }}</div>
        <div class="mt-2 h-[250px]"><BaseChart :config="charts.revenue.value" :rebuild-key="charts.rebuildKey.value" /></div>
      </BaseCard>
      <BaseCard>
        <div class="text-base font-extrabold">{{ t('driverActivity') }}</div>
        <div class="mt-0.5 text-[12.5px] text-muted">{{ t('onlineByHour') }}</div>
        <div class="mt-2 h-[250px]"><BaseChart :config="charts.activity.value" :rebuild-key="charts.rebuildKey.value" /></div>
      </BaseCard>
    </div>

    <DashboardLists />
  </div>
</template>
