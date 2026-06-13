<script setup lang="ts">
import { computed } from 'vue'
import type { Trip } from '@/core/domain/entities'
import { useI18n } from '@/core/composables/useI18n'
import { SEED_DRIVERS, SEED_PASSENGERS } from '@/core/data/mock/seed'
import { egp } from '@/core/utils/format'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const props = defineProps<{ open: boolean; trip: Trip | null }>()
const emit = defineEmits<{ close: [] }>()
const { t, L } = useI18n()

const driver = computed(() => (props.trip ? L(SEED_DRIVERS[props.trip.driver].name) : ''))
const passenger = computed(() => (props.trip ? L(SEED_PASSENGERS[props.trip.pass].name) : ''))
</script>

<template>
  <BaseModal :open="open" width="560px" @close="emit('close')">
    <template v-if="trip">
      <div class="flex items-center justify-between border-b border-border p-[22px]">
        <div>
          <div class="text-[18px] font-black text-primary">{{ trip.id }}</div>
          <div class="text-[12.5px] text-muted">{{ trip.date }}</div>
        </div>
        <button
          type="button"
          class="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-border bg-surface"
          @click="emit('close')"
        >
          <BaseIcon name="close" :size="18" />
        </button>
      </div>
      <div class="p-[22px]">
        <div class="mb-5 flex gap-3.5">
          <div class="flex flex-col items-center pt-1">
            <span class="h-[11px] w-[11px] rounded-full" style="background: #10b981" />
            <span class="my-1 w-0.5 flex-1 bg-border" />
            <span class="h-[11px] w-[11px] rounded-full" style="background: #ef4444" />
          </div>
          <div class="flex-1">
            <div class="mb-[18px]">
              <div class="text-[11px] font-bold uppercase text-muted">{{ t('pickup') }}</div>
              <div class="mt-0.5 text-[14.5px] font-bold">{{ L(trip.from) }}</div>
            </div>
            <div>
              <div class="text-[11px] font-bold uppercase text-muted">{{ t('destination') }}</div>
              <div class="mt-0.5 text-[14.5px] font-bold">{{ L(trip.to) }}</div>
            </div>
          </div>
        </div>
        <div class="mb-4 grid grid-cols-2 gap-3">
          <div class="rounded-xl bg-surface2 p-3.5">
            <div class="text-[11px] font-bold text-muted">{{ t('driverCol') }}</div>
            <div class="mt-0.5 text-sm font-bold">{{ driver }}</div>
          </div>
          <div class="rounded-xl bg-surface2 p-3.5">
            <div class="text-[11px] font-bold text-muted">{{ t('passengerCol') }}</div>
            <div class="mt-0.5 text-sm font-bold">{{ passenger }}</div>
          </div>
        </div>
        <div class="flex items-center justify-between rounded-xl bg-primary-soft p-4">
          <span class="text-[12px] font-bold text-muted">{{ t(`st_${trip.status}`) }}</span>
          <div class="text-[24px] font-black text-primary">{{ egp(trip.price) }}</div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
