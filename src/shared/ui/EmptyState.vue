<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'

withDefaults(defineProps<{ icon?: string; title: string; body?: string }>(), { icon: 'inbox' })
</script>

<template>
  <div class="px-5 py-16 text-center">
    <div
      class="mx-auto mb-3.5 flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-primary-soft text-primary"
    >
      <BaseIcon :name="icon" :size="26" />
    </div>
    <div class="text-base font-extrabold text-text">{{ title }}</div>
    <div v-if="body" class="mx-auto mt-1.5 max-w-[340px] text-[13.5px] text-muted">{{ body }}</div>
    <div class="mt-4"><slot /></div>
  </div>
</template>
