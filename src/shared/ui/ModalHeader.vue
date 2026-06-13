<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'

defineProps<{ title: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="flex items-center justify-between border-b border-border p-[22px]">
    <span class="text-[17px] font-black text-text">{{ title }}</span>
    <button
      type="button"
      class="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-border bg-surface text-text2 hover:bg-surface2"
      @click="emit('close')"
    >
      <BaseIcon name="close" :size="18" />
    </button>
  </div>
</template>
