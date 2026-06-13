<script setup lang="ts">
import BaseIcon from './BaseIcon.vue'
import BaseButton from './BaseButton.vue'
import { useI18n } from '@/core/composables/useI18n'

defineProps<{ title?: string; body?: string }>()
const emit = defineEmits<{ retry: [] }>()
const { t } = useI18n()
</script>

<template>
  <div class="px-5 py-12 text-center">
    <div
      class="mx-auto mb-3.5 flex h-[58px] w-[58px] items-center justify-center rounded-2xl text-danger"
      style="background: rgba(239, 68, 68, 0.1)"
    >
      <BaseIcon name="alert" :size="26" />
    </div>
    <div class="text-base font-extrabold text-text">{{ title ?? t('errorTitle') }}</div>
    <div class="mx-auto mb-4 mt-1.5 max-w-[360px] text-[13px] text-muted">{{ body ?? t('errorBody') }}</div>
    <BaseButton icon="refresh" @click="emit('retry')">{{ t('retry') }}</BaseButton>
  </div>
</template>
