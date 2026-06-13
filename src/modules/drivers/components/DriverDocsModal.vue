<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Driver } from '@/core/domain/entities'
import { useI18n } from '@/core/composables/useI18n'
import { DOC_TYPES } from '@/core/constants/documents'
import { docStatusInfo } from '@/modules/drivers/docStatus'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import DocumentPreview from '@/shared/ui/DocumentPreview.vue'
import DocumentLightbox from '@/shared/modals/DocumentLightbox.vue'

const props = defineProps<{ open: boolean; driver: Driver | null }>()
const emit = defineEmits<{ close: [] }>()
const { t, L } = useI18n()

const verified = computed(() => props.driver?.verified ?? false)
const zoomDoc = ref<string | null>(null)

const docs = computed(() =>
  props.driver
    ? DOC_TYPES.map((doc) => ({
        key: doc.key,
        label: L(doc.label),
        ...docStatusInfo(props.driver!.docs[doc.key] ?? 'missing', t),
      }))
    : [],
)
</script>

<template>
  <BaseModal :open="open" width="620px" @close="emit('close')">
    <template v-if="driver">
      <div class="flex items-center gap-3 border-b border-border px-[22px] py-5">
        <div class="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px] bg-primary-soft text-primary">
          <BaseIcon name="fileCheck" :size="20" />
        </div>
        <div class="flex-1">
          <div class="text-[17px] font-black">{{ t('viewDocs') }}</div>
          <div class="text-[12.5px] text-muted">{{ L(driver.name) }}</div>
        </div>
        <span
          class="inline-flex flex-none items-center gap-1.5 rounded-full px-[11px] py-1 text-[12px] font-bold"
          :style="
            verified
              ? { color: '#10B981', background: 'rgba(16,185,129,.12)' }
              : { color: '#F59E0B', background: 'rgba(245,158,11,.16)' }
          "
        >
          <BaseIcon :name="verified ? 'shieldCheck' : 'clock'" :size="14" />
          {{ verified ? t('verifiedBadge') : t('pendingReview') }}
        </span>
        <button
          type="button"
          class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] border border-border bg-surface"
          @click="emit('close')"
        >
          <BaseIcon name="close" :size="18" />
        </button>
      </div>

      <div class="px-[22px] py-5">
        <div class="mb-3 text-[11.5px] text-muted">{{ t('clickToZoom') }}</div>
        <div class="grid grid-cols-2 gap-3.5">
          <div v-for="doc in docs" :key="doc.key">
            <button
              type="button"
              class="group relative w-full overflow-hidden rounded-[11px] border border-border"
              @click="zoomDoc = doc.key"
            >
              <DocumentPreview :doc-key="doc.key" :holder="driver.name.en" />
              <div
                class="absolute inset-0 flex items-center justify-center bg-[rgba(15,23,42,.28)] opacity-0 transition-opacity group-hover:opacity-100"
              >
                <BaseIcon name="zoomIn" :size="26" class="text-white" />
              </div>
            </button>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-[12.5px] font-bold">{{ doc.label }}</span>
              <span
                class="inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-bold"
                :style="{ color: doc.color, background: doc.bg }"
              >
                <BaseIcon :name="doc.icon" :size="12" />{{ doc.label2 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>

  <DocumentLightbox
    :open="zoomDoc !== null"
    :doc-key="zoomDoc"
    :holder="driver?.name.en"
    @close="zoomDoc = null"
  />
</template>
