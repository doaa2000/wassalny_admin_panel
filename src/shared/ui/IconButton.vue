<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    icon: string
    /** Optional accent colour for the icon (e.g. danger red). */
    color?: string
    size?: number
    title?: string
    disabled?: boolean
  }>(),
  { size: 16, disabled: false },
)

const style = computed(() => (props.color ? { color: props.color } : undefined))
</script>

<template>
  <button
    type="button"
    :title="title"
    :disabled="disabled"
    class="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-border bg-surface text-text2 transition-colors hover:bg-surface2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
    :style="style"
  >
    <BaseIcon :name="icon" :size="size" />
  </button>
</template>
