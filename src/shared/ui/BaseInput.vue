<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'

withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    type?: string
    icon?: string
    /** Force LTR text direction (phone numbers, emails). */
    ltr?: boolean
    label?: string
    error?: string
    disabled?: boolean
  }>(),
  { type: 'text', ltr: false, disabled: false },
)

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <label class="block">
    <span v-if="label" class="mb-[7px] block text-[12.5px] font-bold text-text2">{{ label }}</span>
    <span
      class="flex h-11 items-center gap-2 rounded-[11px] border bg-surface2 px-[14px] transition-colors focus-within:border-primary"
      :class="error ? 'border-danger' : 'border-border'"
    >
      <BaseIcon v-if="icon" :name="icon" :size="18" class="text-muted" />
      <input
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :dir="ltr ? 'ltr' : undefined"
        class="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted disabled:opacity-60"
        :class="ltr ? 'text-start' : ''"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </span>
    <span v-if="error" class="mt-1 block text-xs font-semibold text-danger">{{ error }}</span>
  </label>
</template>
