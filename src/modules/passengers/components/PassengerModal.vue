<script setup lang="ts">
import { computed } from 'vue'
import type { Passenger } from '@/core/domain/entities'
import { useI18n } from '@/core/composables/useI18n'
import { statusPalette } from '@/core/constants/palette'
import { CITIES } from '@/core/constants/localized'
import { avatarColor, initials } from '@/core/utils/avatar'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const props = defineProps<{ open: boolean; passenger: Passenger | null }>()
const emit = defineEmits<{ close: [] }>()
const { t, L } = useI18n()
const palette = computed(() => (props.passenger ? statusPalette(props.passenger.status) : null))
</script>

<template>
  <BaseModal :open="open" width="560px" @close="emit('close')">
    <template v-if="passenger">
      <div class="flex items-center gap-3.5 border-b border-border p-[22px]">
        <div
          class="flex h-14 w-14 flex-none items-center justify-center rounded-full text-[19px] font-black text-white"
          :style="{ background: avatarColor(passenger.name.en) }"
        >
          {{ initials(passenger.name.en) }}
        </div>
        <div class="flex-1">
          <div class="text-[18px] font-black">{{ L(passenger.name) }}</div>
          <div class="text-[13px] text-muted" dir="ltr">{{ passenger.phone }}</div>
        </div>
        <button
          type="button"
          class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] border border-border bg-surface"
          @click="emit('close')"
        >
          <BaseIcon name="close" :size="18" />
        </button>
      </div>
      <div class="grid grid-cols-2 gap-3 p-[22px]">
        <div class="rounded-xl bg-surface2 p-[15px]">
          <div class="text-[22px] font-black">{{ passenger.trips }}</div>
          <div class="mt-0.5 text-[12px] font-semibold text-muted">{{ t('totalTrips') }}</div>
        </div>
        <div class="rounded-xl bg-surface2 p-[15px]">
          <div class="text-[15px] font-black">{{ L(CITIES[passenger.city]) }}</div>
          <div class="mt-0.5 text-[12px] font-semibold text-muted">{{ t('cityCol') }}</div>
        </div>
        <div class="rounded-xl bg-surface2 p-[15px]">
          <div class="text-[14px] font-black">{{ passenger.joined }}</div>
          <div class="mt-0.5 text-[12px] font-semibold text-muted">{{ t('regDate') }}</div>
        </div>
        <div class="rounded-xl bg-surface2 p-[15px]">
          <span
            class="rounded-full px-2.5 py-1 text-[12px] font-bold"
            :style="{ color: palette!.c, background: palette!.b }"
          >
            {{ t(`st_${passenger.status}`) }}
          </span>
          <div class="mt-2 text-[12px] font-semibold text-muted">{{ t('statusCol') }}</div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
