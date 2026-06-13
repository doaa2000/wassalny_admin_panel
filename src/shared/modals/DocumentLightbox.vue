<script setup lang="ts">
import { ref, watch } from 'vue'
import DocumentPreview from '@/shared/ui/DocumentPreview.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import { useI18n } from '@/core/composables/useI18n'
import { clamp } from '@/core/utils/format'

const props = defineProps<{
  open: boolean
  docKey: string | null
  holder?: string
  title?: string
}>()
const emit = defineEmits<{ close: [] }>()
const { L } = useI18n()

const zoom = ref(1)
watch(() => props.open, (v) => { if (v) zoom.value = 1 })

function step(delta: number) {
  zoom.value = clamp(Number((zoom.value + delta).toFixed(2)), 1, 2.4)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="lb">
      <div
        v-if="open && docKey"
        class="fixed inset-0 z-[80] flex flex-col bg-[rgba(8,11,18,.86)] backdrop-blur-[4px]"
        @click.self="emit('close')"
      >
        <div class="flex flex-none items-center justify-between p-[18px_24px]">
          <div class="text-white">
            <div class="text-base font-extrabold">{{ title ?? L({ en: 'Document Viewer', ar: 'عارض المستندات' }) }}</div>
            <div class="text-[12.5px] opacity-70">{{ holder }}</div>
          </div>
          <div class="flex items-center gap-2" @click.stop>
            <button class="lb-btn" @click="step(-0.2)"><BaseIcon name="zoomOut" :size="18" /></button>
            <span class="min-w-[48px] text-center text-[13px] font-extrabold text-white">
              {{ Math.round(zoom * 100) }}%
            </span>
            <button class="lb-btn" @click="step(0.2)"><BaseIcon name="zoomIn" :size="18" /></button>
            <button class="lb-btn ms-2" @click="emit('close')"><BaseIcon name="close" :size="18" /></button>
          </div>
        </div>
        <div class="flex flex-1 items-center justify-center overflow-hidden p-[10px_24px_40px]" @click.self="emit('close')">
          <div
            class="w-[540px] max-w-[88vw] transition-transform duration-200"
            :style="{ transform: `scale(${zoom})` }"
            @click.stop
          >
            <DocumentPreview :doc-key="docKey" :holder="holder ?? 'WD'" big />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lb-btn {
  display: flex;
  height: 42px;
  width: 42px;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
}
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.16s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}
</style>
