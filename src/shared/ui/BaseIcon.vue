<script setup lang="ts">
import { computed } from 'vue'
import { ICON_PATHS } from '@/core/constants/icons'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
    strokeWidth?: number
    /** When true the path is filled instead of stroked (e.g. a filled star). */
    filled?: boolean
  }>(),
  { size: 20, strokeWidth: 1.8, filled: false },
)

const path = computed(() => ICON_PATHS[props.name] ?? '')
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="block shrink-0"
    aria-hidden="true"
  >
    <path :d="path" />
  </svg>
</template>
