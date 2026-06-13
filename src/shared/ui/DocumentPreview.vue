<script setup lang="ts">
import { computed } from 'vue'
import { docTypeOf } from '@/core/constants/documents'
import { initials } from '@/core/utils/avatar'
import { useI18n } from '@/core/composables/useI18n'
import BaseIcon from './BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    docKey: string
    /** Holder name (English) used for portrait initials. */
    holder?: string
    /** Larger rendering for the lightbox. */
    big?: boolean
  }>(),
  { holder: 'WD', big: false },
)

const { L } = useI18n()
const docType = computed(() => docTypeOf(props.docKey))
const label = computed(() => L(docType.value.label))
</script>

<template>
  <div
    class="flex flex-col overflow-hidden border border-[#E2E5EA] bg-[#FBFBF9]"
    :class="big ? 'rounded-2xl' : 'rounded-[10px] shadow-sm'"
    style="aspect-ratio: 1.58"
  >
    <!-- Header band -->
    <div
      class="flex shrink-0 items-center gap-1.5"
      :class="big ? 'h-[34px] px-3.5' : 'h-5 px-2'"
      style="background: linear-gradient(90deg, #f97316, #fb923c)"
    >
      <div
        class="rounded-[3px] bg-white/60"
        :class="big ? 'h-3.5 w-3.5' : 'h-[9px] w-[9px]'"
      />
      <div
        class="font-extrabold uppercase tracking-wide text-white"
        :class="big ? 'text-[12px]' : 'text-[8px]'"
      >
        {{ label }}
      </div>
    </div>

    <!-- Portrait -->
    <div
      v-if="docType.kind === 'portrait'"
      class="flex flex-1 flex-col items-center justify-center"
      :class="big ? 'gap-3.5' : 'gap-2'"
      style="background: linear-gradient(160deg, #ffe9d8, #fbd9c0)"
    >
      <div
        class="flex items-center justify-center rounded-full font-extrabold text-white"
        :style="{
          width: big ? '120px' : '54px',
          height: big ? '120px' : '54px',
          fontSize: big ? '40px' : '18px',
          background: 'linear-gradient(135deg,#F59E0B,#F97316)',
        }"
      >
        {{ initials(holder) }}
      </div>
    </div>

    <!-- Vehicle -->
    <div
      v-else-if="docType.kind === 'vehicle'"
      class="relative flex flex-1 items-end justify-center"
      :class="big ? 'pb-5' : 'pb-2.5'"
      style="background: linear-gradient(160deg, #e7edf3, #d4dee8)"
    >
      <div
        class="w-[72%]"
        :style="{
          height: big ? '70px' : '34px',
          borderRadius: '18px 26px 8px 8px',
          background: 'linear-gradient(135deg,#F97316,#EA580C)',
          boxShadow: '0 6px 14px rgba(234,88,12,.35)',
        }"
      />
    </div>

    <!-- ID / License / Paper -->
    <div
      v-else
      class="flex flex-1 bg-[#FBFBF9]"
      :class="big ? 'gap-4 p-5' : 'gap-2 p-2.5'"
    >
      <div
        class="flex shrink-0 items-center justify-center rounded-md"
        :style="{
          width: big ? '92px' : '40px',
          height: big ? '112px' : '48px',
          background:
            docType.kind === 'id'
              ? 'linear-gradient(135deg,#FFE9D8,#FBD9C0)'
              : 'linear-gradient(135deg,#EEF1F5,#DEE3EA)',
          color: docType.kind === 'id' ? '#F97316' : '#94A3B8',
        }"
      >
        <BaseIcon :name="docType.kind === 'id' ? 'user' : 'fileCheck'" :size="big ? 34 : 16" />
      </div>
      <div class="flex flex-1 flex-col justify-center" :class="big ? 'gap-2.5' : 'gap-1.5'">
        <div class="rounded-full bg-[#F97316]" :style="{ height: big ? '9px' : '6px', width: '80%' }" />
        <div class="rounded-full bg-[#E2E5EA]" :style="{ height: big ? '9px' : '6px', width: '100%' }" />
        <div class="rounded-full bg-[#E2E5EA]" :style="{ height: big ? '9px' : '6px', width: '66%' }" />
        <div class="rounded-full bg-[#E2E5EA]" :style="{ height: big ? '9px' : '6px', width: '90%' }" />
      </div>
    </div>
  </div>
</template>
