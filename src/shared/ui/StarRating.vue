<script setup lang="ts">
import { computed } from 'vue'
import { ICON_PATHS } from '@/core/constants/icons'

const props = withDefaults(defineProps<{ rating: number; size?: number; showValue?: boolean }>(), {
  size: 13,
  showValue: true,
})

const filledCount = computed(() => Math.round(props.rating))
const starPath = ICON_PATHS.star
</script>

<template>
  <span class="inline-flex items-center gap-1.5">
    <span class="inline-flex gap-px">
      <svg
        v-for="i in 5"
        :key="i"
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        :fill="i <= filledCount ? '#F59E0B' : 'none'"
        :stroke="i <= filledCount ? '#F59E0B' : 'var(--c-muted)'"
        stroke-width="1.5"
      >
        <path :d="starPath" />
      </svg>
    </span>
    <span v-if="showValue" class="text-[12.5px] font-bold text-text">{{ rating.toFixed(1) }}</span>
  </span>
</template>
