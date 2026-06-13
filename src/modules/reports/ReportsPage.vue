<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/core/composables/useI18n'
import { PALETTE } from '@/core/constants/palette'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const { t } = useI18n()

const reports = computed(() => [
  { label: t('tripsReport'), icon: 'trips', tint: PALETTE.blue },
  { label: t('driversReport'), icon: 'drivers', tint: PALETTE.orange },
  { label: t('passengersReport'), icon: 'passengers', tint: PALETTE.indigo },
  { label: t('revenueReport'), icon: 'wallet', tint: PALETTE.green },
  { label: t('complaintsReport'), icon: 'complaints', tint: PALETTE.red },
])
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('reports')" :subtitle="t('reportsSub')" />

    <div class="mb-[18px] flex flex-wrap gap-3">
      <div class="flex h-11 items-center gap-2 rounded-[11px] border border-border bg-surface px-3.5 text-[13.5px] font-semibold text-text2">
        <BaseIcon name="calendar" :size="16" /><span>{{ t('dateFrom') }}: 2026-05-13</span>
      </div>
      <div class="flex h-11 items-center gap-2 rounded-[11px] border border-border bg-surface px-3.5 text-[13.5px] font-semibold text-text2">
        <BaseIcon name="calendar" :size="16" /><span>{{ t('dateTo') }}: 2026-06-13</span>
      </div>
    </div>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      <BaseCard v-for="r in reports" :key="r.label">
        <div class="mb-[18px] flex items-center gap-3">
          <div class="flex h-[50px] w-[50px] flex-none items-center justify-center rounded-[14px]" :style="{ background: r.tint.b, color: r.tint.c }">
            <BaseIcon :name="r.icon" :size="24" />
          </div>
          <div class="text-[15.5px] font-extrabold">{{ r.label }}</div>
        </div>
        <div class="flex gap-2.5">
          <BaseButton variant="secondary" size="lg" block icon="file">{{ t('exportPdf') }}</BaseButton>
          <BaseButton variant="secondary" size="lg" block icon="download">{{ t('exportExcel') }}</BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
