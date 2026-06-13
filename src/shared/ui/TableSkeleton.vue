<script setup lang="ts">
withDefaults(defineProps<{ rows?: number }>(), { rows: 6 })
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-border bg-surface py-1.5 shadow-card">
    <div
      v-for="r in rows"
      :key="r"
      class="flex items-center gap-3.5 border-b border-border px-5 py-[15px] last:border-b-0"
    >
      <div class="skeleton h-10 w-10 rounded-full" />
      <div class="flex flex-1 flex-col gap-2">
        <div class="skeleton h-[11px] w-[38%]" />
        <div class="skeleton h-[9px] w-[24%]" />
      </div>
      <div class="skeleton h-6 w-[84px] rounded-full" />
      <div class="skeleton h-[30px] w-[140px] rounded-[9px]" />
    </div>
  </div>
</template>
