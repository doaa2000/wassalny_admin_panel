<script setup lang="ts">
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import { useI18n } from '@/core/composables/useI18n'

withDefaults(
  defineProps<{
    open: boolean
    title: string
    subtitle: string
    confirmLabel: string
    danger?: boolean
    icon?: string
  }>(),
  { danger: false, icon: 'alert' },
)

const emit = defineEmits<{ close: []; confirm: [] }>()
const { t } = useI18n()
</script>

<template>
  <BaseModal :open="open" width="440px" @close="emit('close')">
    <div class="p-[26px] text-center">
      <div
        class="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-2xl"
        :style="{
          background: danger ? 'rgba(239,68,68,.12)' : 'var(--c-primary-soft)',
          color: danger ? '#EF4444' : 'var(--c-primary)',
        }"
      >
        <BaseIcon :name="icon" :size="26" />
      </div>
      <div class="mb-1.5 text-[19px] font-black">{{ title }}</div>
      <div class="mb-6 text-[13.5px] leading-relaxed text-text2">{{ subtitle }}</div>
      <div class="flex gap-[11px]">
        <BaseButton variant="secondary" size="lg" block @click="emit('close')">{{ t('cancel') }}</BaseButton>
        <BaseButton :variant="danger ? 'danger' : 'primary'" size="lg" block @click="emit('confirm')">
          {{ confirmLabel }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
