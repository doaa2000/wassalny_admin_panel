<script setup lang="ts">
import { computed } from 'vue'
import type { Driver } from '@/core/domain/entities'
import { useI18n } from '@/core/composables/useI18n'
import { statusPalette } from '@/core/constants/palette'
import { avatarColor, initials } from '@/core/utils/avatar'
import { VEHICLE_TYPES, CITIES } from '@/core/constants/localized'
import { egp } from '@/core/utils/format'
import { DOC_TYPES } from '@/core/constants/documents'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const props = defineProps<{ open: boolean; driver: Driver | null }>()
const emit = defineEmits<{ close: [] }>()
const { t, L } = useI18n()

const palette = computed(() => (props.driver ? statusPalette(props.driver.status) : null))

const history = computed(() =>
  props.driver
    ? [
        { route: `${L(CITIES.cairo)} → ${L(CITIES.giza)}`, date: '2026-06-12 18:20', price: egp(72), status: 'completed' },
        { route: `${L(CITIES.alex)} → ${L(CITIES.cairo)}`, date: '2026-06-10 09:05', price: egp(95), status: 'completed' },
        { route: `${L(CITIES.giza)} → ${L(CITIES.cairo)}`, date: '2026-06-08 14:42', price: egp(48), status: 'cancelled' },
      ]
    : [],
)
</script>

<template>
  <BaseModal :open="open" width="640px" @close="emit('close')">
    <template v-if="driver">
      <div
        class="relative border-b border-border p-6"
        style="background: linear-gradient(135deg, var(--c-primary-soft), transparent)"
      >
        <button
          type="button"
          class="absolute top-[18px] flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-border bg-surface ltr:right-[18px] rtl:left-[18px]"
          @click="emit('close')"
        >
          <BaseIcon name="close" :size="18" />
        </button>
        <div class="flex items-center gap-4">
          <div
            class="flex h-[72px] w-[72px] flex-none items-center justify-center rounded-[20px] text-[26px] font-black text-white"
            :style="{ background: avatarColor(driver.name.en) }"
          >
            {{ initials(driver.name.en) }}
          </div>
          <div>
            <div class="text-[21px] font-black">{{ L(driver.name) }}</div>
            <div class="mt-0.5 text-[13px] text-text2" dir="ltr">{{ driver.phone }}</div>
            <div class="mt-2">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-[11px] py-1 text-[12px] font-bold"
                :style="{ color: palette!.c, background: palette!.b }"
              >
                <span class="h-1.5 w-1.5 rounded-full" :style="{ background: palette!.c }" />
                {{ t(`st_${driver.status}`) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-[22px]">
        <!-- Stats -->
        <div class="mb-[22px] grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="rounded-[13px] bg-surface2 px-2 py-3.5 text-center">
            <div class="text-[19px] font-black">{{ driver.trips }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-muted">{{ t('totalTrips') }}</div>
          </div>
          <div class="rounded-[13px] bg-surface2 px-2 py-3.5 text-center">
            <div class="text-[19px] font-black text-warning">{{ driver.rating.toFixed(1) }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-muted">{{ t('avgRating') }}</div>
          </div>
          <div class="rounded-[13px] bg-surface2 px-2 py-3.5 text-center">
            <div class="text-[15px] font-black text-success">{{ egp(driver.trips * 58) }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-muted">{{ t('totalEarnings') }}</div>
          </div>
          <div class="rounded-[13px] bg-surface2 px-2 py-3.5 text-center">
            <div class="text-[13px] font-extrabold">{{ driver.joined }}</div>
            <div class="mt-0.5 text-[11px] font-semibold text-muted">{{ t('memberSince') }}</div>
          </div>
        </div>

        <!-- Vehicle + Documents -->
        <div class="mb-2.5 text-[13px] font-extrabold">{{ t('documents') }}</div>
        <div class="mb-[22px] flex flex-col gap-2.5">
          <div
            v-for="doc in DOC_TYPES"
            :key="doc.key"
            class="flex items-center gap-[11px] rounded-[11px] border border-border px-3.5 py-3"
          >
            <div
              class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] bg-primary-soft text-primary"
            >
              <BaseIcon name="fileCheck" :size="18" />
            </div>
            <div class="flex-1">
              <div class="text-[13px] font-bold">{{ L(doc.label) }}</div>
              <div class="text-[12px] text-muted">
                {{ L(VEHICLE_TYPES[driver.vt]) }} · {{ driver.vnum }}
              </div>
            </div>
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold text-success"
              style="background: rgba(16, 185, 129, 0.12)"
            >
              <BaseIcon name="checkCircle" :size="14" />{{ t('verified') }}
            </span>
          </div>
        </div>

        <!-- Trip history -->
        <div class="mb-2.5 text-[13px] font-extrabold">{{ t('tripHistory') }}</div>
        <div class="flex flex-col gap-2">
          <div
            v-for="(h, i) in history"
            :key="i"
            class="flex items-center gap-[11px] rounded-[11px] bg-surface2 px-3.5 py-3"
          >
            <div class="flex-1">
              <div class="text-[13px] font-bold">{{ h.route }}</div>
              <div class="text-[11.5px] text-muted">{{ h.date }}</div>
            </div>
            <div class="text-[13px] font-extrabold">{{ h.price }}</div>
            <span class="text-[11px] font-bold" :style="{ color: statusPalette(h.status).c }">
              {{ t(`st_${h.status}` as never) }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
