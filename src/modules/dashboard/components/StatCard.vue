<script setup lang="ts">
import { computed } from 'vue'
import { PALETTE, type PaletteKey } from '@/core/constants/palette'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const props = defineProps<{
  icon: string
  value: string
  label: string
  delta: string
  up: boolean
  palette: string
}>()

const tint = computed(() => PALETTE[(props.palette as PaletteKey)] ?? PALETTE.gray)
const deltaTint = computed(() => (props.up ? PALETTE.green : PALETTE.red))
</script>

<template>
  <div class="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card">
    <div class="flex items-center justify-between">
      <div
        class="flex h-11 w-11 items-center justify-center rounded-[13px]"
        :style="{ background: tint.b, color: tint.c }"
      >
        <BaseIcon :name="icon" :size="22" />
      </div>
      <div
        class="flex items-center gap-1 rounded-full px-2.5 py-1 text-[12.5px] font-extrabold"
        :style="{ color: deltaTint.c, background: deltaTint.b }"
      >
        <BaseIcon :name="up ? 'arrowUp' : 'arrowDown'" :size="13" :stroke-width="2.6" />
        <span>{{ delta }}</span>
      </div>
    </div>
    <div>
      <div class="text-[27px] font-black leading-none tracking-tight">{{ value }}</div>
      <div class="mt-1.5 text-[13px] font-semibold text-text2">{{ label }}</div>
    </div>
  </div>
</template>
