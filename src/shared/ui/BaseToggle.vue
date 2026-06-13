<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; label?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <div class="flex items-center justify-between">
    <span v-if="label" class="text-[13.5px] font-bold text-text">{{ label }}</span>
    <button
      type="button"
      role="switch"
      :aria-checked="props.modelValue"
      class="relative h-[26px] w-[46px] rounded-full transition-colors"
      :style="{ background: props.modelValue ? 'var(--c-primary)' : 'var(--c-border)' }"
      @click="emit('update:modelValue', !props.modelValue)"
    >
      <span
        class="absolute top-0.5 h-[22px] w-[22px] rounded-full bg-white shadow transition-all"
        :style="{ insetInlineStart: props.modelValue ? '22px' : '2px' }"
      />
    </button>
  </div>
</template>
