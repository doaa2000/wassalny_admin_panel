<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <div class="mb-[22px] flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="m-0 text-[26px] font-black tracking-tight">{{ title }}</h1>
      <p v-if="subtitle" class="mt-1.5 text-sm text-text2">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="flex gap-2.5"><slot name="actions" /></div>
  </div>
</template>
