<script setup lang="ts">
export interface SelectOption {
  value: string
  label: string
}

withDefaults(
  defineProps<{
    modelValue?: string
    options: SelectOption[]
    label?: string
    disabled?: boolean
  }>(),
  { disabled: false },
)

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <label class="block">
    <span v-if="label" class="mb-[7px] block text-[12.5px] font-bold text-text2">{{ label }}</span>
    <select
      :value="modelValue"
      :disabled="disabled"
      class="h-11 cursor-pointer rounded-[11px] border border-border bg-surface px-[14px] text-[13.5px] font-semibold text-text outline-none transition-colors focus:border-primary disabled:opacity-60"
      :class="label ? 'w-full' : ''"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </label>
</template>
