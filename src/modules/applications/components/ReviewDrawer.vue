<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DriverApplication } from '@/core/domain/entities'
import { useI18n } from '@/core/composables/useI18n'
import { DOC_TYPES } from '@/core/constants/documents'
import { VEHICLE_TYPES, CITIES } from '@/core/constants/localized'
import { avatarColor, initials } from '@/core/utils/avatar'
import { docStatusInfo } from '@/modules/drivers/docStatus'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import DocumentPreview from '@/shared/ui/DocumentPreview.vue'
import DocumentLightbox from '@/shared/modals/DocumentLightbox.vue'

const props = defineProps<{ application: DriverApplication | null }>()
const emit = defineEmits<{ close: []; approve: [id: string]; reject: [id: string] }>()
const { t, L } = useI18n()

// 0 = review docs · 1 = confirm approval · 2 = reject · 3 = request info
const stage = ref(0)
const approveChecked = ref(false)
const zoomDoc = ref<string | null>(null)

watch(
  () => props.application,
  () => {
    stage.value = 0
    approveChecked.value = false
  },
)

const docs = computed(() =>
  props.application
    ? DOC_TYPES.map((doc) => ({
        key: doc.key,
        label: L(doc.label),
        optional: doc.optional,
        ...docStatusInfo(props.application!.docs[doc.key] ?? 'missing', t),
      }))
    : [],
)

const allValid = computed(() =>
  props.application
    ? DOC_TYPES.filter((d) => !d.optional).every((d) => props.application!.docs[d.key] === 'valid')
    : false,
)
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="application"
        class="fixed inset-0 z-[70] flex justify-end bg-[rgba(8,12,22,.5)] backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div
          class="flex h-full w-[560px] max-w-[96vw] animate-slideIn flex-col border-border bg-surface shadow-lg ltr:border-l rtl:border-r"
        >
          <!-- Header -->
          <div class="flex flex-none items-center gap-3 border-b border-border px-6 py-5">
            <div
              class="flex h-12 w-12 flex-none items-center justify-center rounded-full text-base font-extrabold text-white"
              :style="{ background: avatarColor(application.name.en) }"
            >
              {{ initials(application.name.en) }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-[17px] font-black">{{ L(application.name) }}</div>
              <div class="text-[12.5px] text-muted">{{ application.id }} · {{ application.submitted }}</div>
            </div>
            <button
              type="button"
              class="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] border border-border bg-surface"
              @click="emit('close')"
            >
              <BaseIcon name="close" :size="18" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <!-- Stage 0: documents -->
            <template v-if="stage === 0">
              <div class="mb-5 grid grid-cols-3 gap-2.5">
                <div class="rounded-[11px] bg-surface2 p-3">
                  <div class="text-[11px] font-bold text-muted">{{ t('vehicleType') }}</div>
                  <div class="mt-0.5 text-[13.5px] font-bold">{{ L(VEHICLE_TYPES[application.vt]) }}</div>
                </div>
                <div class="rounded-[11px] bg-surface2 p-3">
                  <div class="text-[11px] font-bold text-muted">{{ t('vehicleNum') }}</div>
                  <div class="mt-0.5 text-[13.5px] font-bold">{{ application.vnum }}</div>
                </div>
                <div class="rounded-[11px] bg-surface2 p-3">
                  <div class="text-[11px] font-bold text-muted">{{ t('cityCol') }}</div>
                  <div class="mt-0.5 text-[13.5px] font-bold">{{ L(CITIES[application.city]) }}</div>
                </div>
              </div>
              <div class="mb-3 flex items-center justify-between">
                <span class="text-[12px] font-extrabold uppercase tracking-wide text-muted">
                  {{ t('uploadedDocs') }}
                </span>
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-[11px] py-1 text-[12px] font-bold"
                  :style="
                    allValid
                      ? { color: '#10B981', background: 'rgba(16,185,129,.12)' }
                      : { color: '#F59E0B', background: 'rgba(245,158,11,.16)' }
                  "
                >
                  <BaseIcon :name="allValid ? 'checkCircle' : 'alert'" :size="14" />
                  {{ allValid ? t('allDocsValid') : t('docsIncomplete') }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-3.5">
                <div v-for="doc in docs" :key="doc.key">
                  <button
                    type="button"
                    class="relative w-full overflow-hidden rounded-[11px] border border-border"
                    @click="zoomDoc = doc.key"
                  >
                    <DocumentPreview :doc-key="doc.key" :holder="application.name.en" />
                    <div
                      class="absolute top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(15,23,42,.55)] ltr:left-1.5 rtl:right-1.5"
                    >
                      <BaseIcon name="zoomIn" :size="15" class="text-white" />
                    </div>
                  </button>
                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-[12px] font-bold">
                      {{ doc.label }}
                      <span v-if="doc.optional" class="text-[10px] font-semibold text-muted">· {{ t('docOptional') }}</span>
                    </span>
                    <span
                      class="inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10.5px] font-bold"
                      :style="{ color: doc.color, background: doc.bg }"
                    >
                      <BaseIcon :name="doc.icon" :size="11" />{{ doc.label2 }}
                    </span>
                  </div>
                </div>
              </div>
            </template>

            <!-- Stage 1: approve confirm -->
            <template v-else-if="stage === 1">
              <div class="px-0 pb-1 pt-1.5 text-center">
                <div
                  class="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-2xl"
                  style="background: rgba(16, 185, 129, 0.1)"
                >
                  <BaseIcon name="userCheck" :size="26" style="color: #10b981" />
                </div>
                <div class="mb-2 text-[19px] font-black">{{ t('approveStep') }}</div>
                <div
                  class="mb-[18px] flex items-start gap-3 rounded-xl border px-4 py-3 text-start"
                  style="background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2)"
                >
                  <BaseIcon name="alert" :size="18" class="flex-none text-warning" />
                  <span class="text-[13px] font-semibold text-text2">{{ t('approveWarn') }}</span>
                </div>
                <button
                  type="button"
                  class="flex w-full items-center gap-3 rounded-xl border-[1.5px] px-4 py-4 text-start"
                  :style="{
                    borderColor: approveChecked ? '#10B981' : 'var(--c-border)',
                    background: approveChecked ? 'rgba(16,185,129,.06)' : 'var(--c-surface)',
                  }"
                  @click="approveChecked = !approveChecked"
                >
                  <span
                    class="flex h-6 w-6 flex-none items-center justify-center rounded-[7px] border-2"
                    :style="{
                      borderColor: approveChecked ? '#10B981' : 'var(--c-border)',
                      background: approveChecked ? '#10B981' : 'transparent',
                    }"
                  >
                    <BaseIcon v-if="approveChecked" name="check" :size="14" class="text-white" />
                  </span>
                  <span class="text-[13.5px] font-semibold leading-relaxed">{{ t('approveConfirmText') }}</span>
                </button>
              </div>
            </template>

            <!-- Stage 2: reject -->
            <template v-else-if="stage === 2">
              <div class="mb-2.5 text-[12.5px] font-bold text-text2">{{ t('rejectReason') }}</div>
              <textarea
                rows="5"
                :placeholder="`${t('rejectReason')}…`"
                class="w-full resize-none rounded-xl border border-border bg-surface2 px-4 py-3 text-sm text-text outline-none focus:border-primary"
              />
            </template>

            <!-- Stage 3: request info -->
            <template v-else>
              <div class="mb-2.5 text-[12.5px] font-bold text-text2">{{ t('reqInfoWhich') }}</div>
              <textarea
                rows="5"
                :placeholder="t('reqInfoWhich')"
                class="w-full resize-none rounded-xl border border-border bg-surface2 px-4 py-3 text-sm text-text outline-none focus:border-primary"
              />
            </template>
          </div>

          <!-- Footer -->
          <div class="flex-none border-t border-border px-6 py-4">
            <div v-if="stage === 0" class="flex gap-2.5">
              <BaseButton variant="success" size="lg" block icon="userCheck" @click="stage = 1">{{ t('approve') }}</BaseButton>
              <BaseButton variant="secondary" size="lg" icon="info" :title="t('requestInfo')" @click="stage = 3" />
              <BaseButton variant="secondary" size="lg" icon="xCircle" @click="stage = 2">{{ t('reject') }}</BaseButton>
            </div>
            <div v-else-if="stage === 1" class="flex gap-2.5">
              <BaseButton variant="secondary" size="lg" @click="stage = 0">{{ t('back') }}</BaseButton>
              <BaseButton
                variant="success"
                size="lg"
                block
                icon="check"
                :disabled="!approveChecked"
                @click="emit('approve', application.id)"
              >
                {{ t('confirmApprove') }}
              </BaseButton>
            </div>
            <div v-else-if="stage === 2" class="flex gap-2.5">
              <BaseButton variant="secondary" size="lg" @click="stage = 0">{{ t('back') }}</BaseButton>
              <BaseButton variant="danger" size="lg" block @click="emit('reject', application.id)">{{ t('reject') }}</BaseButton>
            </div>
            <div v-else class="flex gap-2.5">
              <BaseButton variant="secondary" size="lg" @click="stage = 0">{{ t('back') }}</BaseButton>
              <BaseButton size="lg" block icon="send" @click="emit('close')">{{ t('requestInfo') }}</BaseButton>
            </div>
          </div>
        </div>

        <DocumentLightbox
          :open="zoomDoc !== null"
          :doc-key="zoomDoc"
          :holder="application.name.en"
          @close="zoomDoc = null"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.18s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
</style>
