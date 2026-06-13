<script setup lang="ts">
import { computed } from 'vue'
import { avatarColor, initials } from '@/core/utils/avatar'

const props = withDefaults(
  defineProps<{
    /** English name used for deterministic colour + initials. */
    name: string
    size?: number
    /** Render a circle (default) or a rounded square. */
    square?: boolean
    /** Optional explicit background (overrides the deterministic colour). */
    background?: string
    /** Show an online indicator dot. */
    online?: boolean
  }>(),
  { size: 40, square: false },
)

const bg = computed(() => props.background ?? avatarColor(props.name))
const text = computed(() => initials(props.name))
const fontSize = computed(() => Math.round(props.size * 0.35))
</script>

<template>
  <div class="relative shrink-0">
    <div
      class="flex items-center justify-center font-extrabold text-white"
      :class="square ? 'rounded-xl' : 'rounded-full'"
      :style="{ width: `${size}px`, height: `${size}px`, background: bg, fontSize: `${fontSize}px` }"
    >
      {{ text }}
    </div>
    <span
      v-if="online"
      class="absolute bottom-0 h-[11px] w-[11px] rounded-full border-2 border-surface bg-success ltr:right-0 rtl:left-0"
    />
  </div>
</template>
