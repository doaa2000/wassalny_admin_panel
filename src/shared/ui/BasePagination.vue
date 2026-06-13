<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ page: number; pageCount: number }>()
const emit = defineEmits<{ 'update:page': [page: number] }>()

const pages = computed(() => Array.from({ length: Math.max(1, props.pageCount) }, (_, i) => i + 1))

function go(p: number) {
  if (p >= 1 && p <= props.pageCount) emit('update:page', p)
}
</script>

<template>
  <div class="flex gap-1.5">
    <button
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text2 disabled:opacity-40"
      :disabled="page <= 1"
      @click="go(page - 1)"
    >
      ‹
    </button>
    <button
      v-for="p in pages"
      :key="p"
      type="button"
      class="h-8 w-8 rounded-lg text-sm font-extrabold transition-colors"
      :class="
        p === page
          ? 'border-none bg-primary text-white'
          : 'border border-border bg-surface text-text2 hover:bg-surface2'
      "
      @click="go(p)"
    >
      {{ p }}
    </button>
    <button
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text2 disabled:opacity-40"
      :disabled="page >= pageCount"
      @click="go(page + 1)"
    >
      ›
    </button>
  </div>
</template>
