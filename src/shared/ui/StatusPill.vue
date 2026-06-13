<script setup lang="ts">
import { computed } from 'vue'
import { statusPalette } from '@/core/constants/palette'

const props = withDefaults(
  defineProps<{
    /** Status/priority key used to resolve the palette. */
    status: string
    label: string
    /** Render the small leading dot. */
    dot?: boolean
  }>(),
  { dot: true },
)

const palette = computed(() => statusPalette(props.status))
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-[11px] py-1 text-[12.5px] font-bold"
    :style="{ color: palette.c, background: palette.b }"
  >
    <span
      v-if="dot"
      class="h-1.5 w-1.5 rounded-full"
      :style="{ background: palette.c }"
    />
    {{ label }}
  </span>
</template>
