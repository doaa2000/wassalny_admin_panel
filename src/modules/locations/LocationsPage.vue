<script setup lang="ts">
import { computed } from 'vue'
import { repositories } from '@/core/di/container'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useI18n } from '@/core/composables/useI18n'
import { CITIES } from '@/core/constants/localized'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import IconButton from '@/shared/ui/IconButton.vue'
import StatusPill from '@/shared/ui/StatusPill.vue'
import { PALETTE } from '@/core/constants/palette'

const { t, L } = useI18n()
const { data } = useAsyncData(() => repositories().locations.listGovernorates())
const govs = computed(() => data.value ?? [])

const cities = computed(() =>
  Object.entries(CITIES).slice(0, 8).map(([key, name], i) => ({
    key,
    name: L(name),
    gov: L(CITIES[['cairo', 'giza', 'alex'][i % 3]]),
    drivers: 40 + ((i * 37) % 200),
  })),
)
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('locations')" :subtitle="t('locSub')" />
    <div class="grid grid-cols-1 gap-[18px] lg:grid-cols-[1.4fr_1fr]">
      <!-- Governorates -->
      <BaseCard :padded="false">
        <div class="flex items-center justify-between border-b border-border px-5 py-4">
          <span class="text-[15px] font-extrabold">{{ t('governorates') }}</span>
          <BaseButton size="sm" icon="plus">{{ t('addGov') }}</BaseButton>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse" style="min-width: 440px">
            <thead>
              <tr class="bg-surface2">
                <th class="px-5 py-3 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('govName') }}</th>
                <th class="px-4 py-3 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('citiesCount') }}</th>
                <th class="px-4 py-3 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('driversCount') }}</th>
                <th class="px-4 py-3 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('statusCol') }}</th>
                <th class="px-5 py-3 text-end text-[12px] font-extrabold uppercase text-muted">{{ t('actionsCol') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="g in govs" :key="g.id" class="border-t border-border">
                <td class="px-5 py-3.5 text-sm font-bold">{{ L(g.name) }}</td>
                <td class="px-4 py-3.5 text-[13.5px] text-text2">{{ g.cities }}</td>
                <td class="px-4 py-3.5 text-[13.5px] text-text2">{{ g.drivers }}</td>
                <td class="px-4 py-3.5"><StatusPill :status="g.status" :label="t(`st_${g.status}`)" :dot="false" /></td>
                <td class="px-5 py-3.5">
                  <div class="flex justify-end gap-1.5">
                    <IconButton icon="edit" :size="14" />
                    <IconButton icon="trash" :size="14" :color="PALETTE.red.c" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <!-- Cities -->
      <BaseCard :padded="false" class="self-start">
        <div class="flex items-center justify-between border-b border-border px-5 py-4">
          <span class="text-[15px] font-extrabold">{{ t('cities') }}</span>
          <BaseButton size="sm" variant="secondary" icon="plus">{{ t('addCity') }}</BaseButton>
        </div>
        <div
          v-for="c in cities"
          :key="c.key"
          class="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-b-0"
        >
          <div class="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-primary-soft text-primary">
            <BaseIcon name="mapPin" :size="18" />
          </div>
          <div class="flex-1">
            <div class="text-[13.5px] font-bold">{{ c.name }}</div>
            <div class="text-[11.5px] text-muted">{{ c.gov }}</div>
          </div>
          <span class="text-[12px] font-semibold text-text2">{{ c.drivers }} {{ t('driversCount') }}</span>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
