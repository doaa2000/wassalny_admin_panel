<script setup lang="ts">
import { watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    /** CSS width of the dialog (e.g. '540px'). */
    width?: string
  }>(),
  { width: '540px' },
)

const emit = defineEmits<{ close: [] }>()

// Lock body scroll while a modal is open.
watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(8,12,22,.55)] p-6 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div
          class="max-h-[90vh] w-full max-w-[94vw] animate-pop overflow-y-auto rounded-[20px] border border-border bg-surface shadow-lg"
          :style="{ width }"
          role="dialog"
          aria-modal="true"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.18s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
