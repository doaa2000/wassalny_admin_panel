<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    icon?: string
    /** Place icon after the label instead of before. */
    iconTrailing?: boolean
    block?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', size: 'md', iconTrailing: false, block: false, disabled: false, type: 'button' },
)

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-white border-transparent shadow-glow hover:bg-primary-dark',
  secondary: 'bg-surface text-text border-border hover:bg-surface2',
  ghost: 'bg-transparent text-text2 border-transparent hover:bg-surface2',
  danger: 'bg-danger text-white border-transparent hover:opacity-90',
  success: 'bg-success text-white border-transparent hover:opacity-90',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-3 text-[13px] gap-1.5 rounded-[10px]',
  md: 'h-[42px] px-[17px] text-[13.5px] gap-2 rounded-[11px]',
  lg: 'h-[46px] px-5 text-sm gap-2 rounded-xl',
}

const classes = computed(() => [
  'inline-flex items-center justify-center font-extrabold border transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  variantClass[props.variant],
  sizeClass[props.size],
  props.block ? 'w-full' : '',
])

const iconSize = computed(() => (props.size === 'sm' ? 16 : 18))
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes">
    <BaseIcon v-if="icon && !iconTrailing" :name="icon" :size="iconSize" />
    <span v-if="$slots.default"><slot /></span>
    <BaseIcon v-if="icon && iconTrailing" :name="icon" :size="iconSize" />
  </button>
</template>
