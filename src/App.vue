<script setup lang="ts">
// The UI store applies theme/direction document attributes on creation.
import { useUiStore } from '@/stores/ui.store'
useUiStore()
</script>

<template>
  <RouterView />
</template>
