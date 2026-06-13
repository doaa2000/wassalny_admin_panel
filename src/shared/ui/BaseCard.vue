<script setup lang="ts">
withDefaults(defineProps<{ padded?: boolean; noOverflow?: boolean }>(), {
  padded: true,
  noOverflow: true,
})
</script>

<template>
  <div
    class="rounded-2xl border border-border bg-surface shadow-card"
    :class="[padded ? 'p-5' : '', noOverflow ? 'overflow-hidden' : '']"
  >
    <slot />
  </div>
</template>
