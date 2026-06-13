<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { z } from 'zod'
import type { Driver } from '@/core/domain/entities'
import { useI18n } from '@/core/composables/useI18n'
import { DOC_TYPES } from '@/core/constants/documents'
import { VEHICLE_TYPES, CITIES } from '@/core/constants/localized'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: []; create: [driver: Driver] }>()
const { t, L } = useI18n()

const STEPS = ['stepIdentity', 'stepVehicle', 'stepDocuments', 'stepReview'] as const
// step -1 = gate, 0..3 = wizard steps
const step = ref(-1)

const form = reactive({ name: '', phone: '', city: 'cairo', vt: 'economy', vnum: '' })
const uploaded = reactive<Record<string, boolean>>({})
const errors = reactive<Record<string, string>>({})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      step.value = -1
      Object.assign(form, { name: '', phone: '', city: 'cairo', vt: 'economy', vnum: '' })
      Object.keys(uploaded).forEach((k) => delete uploaded[k])
      Object.keys(errors).forEach((k) => delete errors[k])
    }
  },
)

const identitySchema = z.object({
  name: z.string().min(3, 'Name is required'),
  phone: z.string().min(8, 'Valid phone required'),
  city: z.string().min(1),
})
const vehicleSchema = z.object({ vt: z.string().min(1), vnum: z.string().min(3, 'Plate required') })

const cityOptions = computed(() =>
  Object.keys(CITIES).slice(0, 5).map((k) => ({ value: k, label: L(CITIES[k]) })),
)
const vtOptions = computed(() =>
  Object.keys(VEHICLE_TYPES).slice(0, 4).map((k) => ({ value: k, label: L(VEHICLE_TYPES[k]) })),
)

const requiredDocs = DOC_TYPES.filter((d) => !d.optional)
const showStepper = computed(() => step.value >= 0)

const stepRows = computed(() =>
  STEPS.map((label, i) => ({
    label: t(label),
    done: step.value > i,
    current: step.value === i,
    last: i === STEPS.length - 1,
  })),
)

function validateStep(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (step.value === 0) {
    const res = identitySchema.safeParse(form)
    if (!res.success) {
      for (const issue of res.error.issues) errors[issue.path[0] as string] = issue.message
      return false
    }
  }
  if (step.value === 1) {
    const res = vehicleSchema.safeParse(form)
    if (!res.success) {
      for (const issue of res.error.issues) errors[issue.path[0] as string] = issue.message
      return false
    }
  }
  if (step.value === 2) {
    const allUploaded = requiredDocs.every((d) => uploaded[d.key])
    if (!allUploaded) {
      errors.docs = t('required')
      return false
    }
  }
  return true
}

function next() {
  if (step.value === -1) {
    step.value = 0
    return
  }
  if (!validateStep()) return
  step.value = Math.min(STEPS.length - 1, step.value + 1)
}
function back() {
  step.value = Math.max(0, step.value - 1)
}

function create() {
  const id = 'DR-' + (2051 + Math.floor(Math.random() * 900))
  emit('create', {
    id,
    name: { en: form.name, ar: form.name },
    phone: form.phone,
    vt: form.vt,
    vnum: form.vnum,
    city: form.city,
    status: 'pending',
    rating: 0,
    trips: 0,
    joined: new Date().toISOString().slice(0, 10),
    manual: true,
    verified: false,
    docs: { nid: 'valid', license: 'valid', vehReg: 'valid', photo: 'valid', vehPhoto: 'valid' },
  })
}
</script>

<template>
  <BaseModal :open="open" width="600px" @close="emit('close')">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-border px-[22px] py-[18px]">
      <div class="flex items-center gap-2.5">
        <div class="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-primary-soft text-primary">
          <BaseIcon name="userCheck" :size="18" />
        </div>
        <span class="text-[17px] font-black">{{ t('addDriver') }}</span>
      </div>
      <button
        type="button"
        class="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-border bg-surface"
        @click="emit('close')"
      >
        <BaseIcon name="close" :size="18" />
      </button>
    </div>

    <!-- Stepper -->
    <div v-if="showStepper" class="flex items-center px-[22px] pb-1 pt-[18px]">
      <div v-for="(s, i) in stepRows" :key="i" class="flex flex-1 items-center">
        <div class="flex flex-none flex-col items-center gap-1.5">
          <div
            class="flex h-[30px] w-[30px] items-center justify-center rounded-full border text-[13px] font-extrabold"
            :style="
              s.done || s.current
                ? { background: 'var(--c-primary)', color: '#fff', borderColor: 'var(--c-primary)' }
                : { background: 'var(--c-surface2)', color: 'var(--c-muted)', borderColor: 'var(--c-border)' }
            "
          >
            <BaseIcon v-if="s.done" name="check" :size="15" />
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="whitespace-nowrap text-[10.5px] font-bold" :class="s.current ? 'text-text' : 'text-muted'">
            {{ s.label }}
          </span>
        </div>
        <div
          v-if="!s.last"
          class="mb-[18px] h-0.5 flex-1"
          :style="{ background: s.done ? 'var(--c-primary)' : 'var(--c-border)', margin: '0 6px' }"
        />
      </div>
    </div>

    <!-- Body -->
    <div class="min-h-[230px] px-[22px] pb-1 pt-[18px]">
      <!-- Gate -->
      <div v-if="step === -1" class="px-0 pb-1.5 pt-2 text-center">
        <div class="mx-auto mb-4 flex h-[62px] w-[62px] items-center justify-center rounded-[17px] bg-primary-soft text-primary">
          <BaseIcon name="lock" :size="28" />
        </div>
        <div class="mb-2 text-[18px] font-black">{{ t('manualGateTitle') }}</div>
        <div class="mx-auto mb-[18px] max-w-[440px] text-[13.5px] leading-relaxed text-text2">
          {{ t('manualGateBody') }}
        </div>
        <div
          class="inline-flex items-center gap-2 rounded-[11px] border px-4 py-[11px]"
          style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2)"
        >
          <BaseIcon name="shieldCheck" :size="18" style="color: #10b981" />
          <span class="text-[13px] font-bold" style="color: #10b981">{{ t('youAreSuper') }}</span>
        </div>
      </div>

      <!-- Identity -->
      <div v-else-if="step === 0" class="flex flex-col gap-3.5">
        <BaseInput v-model="form.name" :label="t('fullName')" :placeholder="t('fullName')" :error="errors.name" />
        <div class="grid grid-cols-2 gap-3.5">
          <BaseInput v-model="form.phone" :label="t('phoneNum')" placeholder="+20 1XX XXX XXXX" ltr :error="errors.phone" />
          <BaseSelect v-model="form.city" :label="t('cityCol')" :options="cityOptions" />
        </div>
      </div>

      <!-- Vehicle -->
      <div v-else-if="step === 1" class="grid grid-cols-2 gap-3.5">
        <BaseSelect v-model="form.vt" :label="t('vehicleType')" :options="vtOptions" />
        <BaseInput v-model="form.vnum" :label="t('vehicleNum')" placeholder="CAI 0000" :error="errors.vnum" />
      </div>

      <!-- Documents -->
      <div v-else-if="step === 2" class="flex flex-col gap-2.5">
        <button
          v-for="doc in DOC_TYPES"
          :key="doc.key"
          type="button"
          class="flex w-full items-center gap-3 rounded-xl border-[1.5px] border-dashed px-4 py-3 text-start"
          :style="{
            borderColor: uploaded[doc.key] ? '#10B981' : 'var(--c-border)',
            background: uploaded[doc.key] ? 'rgba(16,185,129,.06)' : 'var(--c-surface2)',
          }"
          @click="uploaded[doc.key] = true"
        >
          <BaseIcon :name="uploaded[doc.key] ? 'fileCheck' : 'uploadCloud'" :size="22" class="flex-none text-primary" />
          <div class="flex-1">
            <div class="text-[13.5px] font-bold text-text">
              {{ L(doc.label) }}
              <span v-if="doc.optional" class="text-[11px] font-normal text-muted">({{ t('docOptional') }})</span>
            </div>
            <div class="text-[11.5px] text-muted">{{ t('dropHint') }}</div>
          </div>
          <span
            class="flex-none text-[11.5px] font-extrabold"
            :style="{ color: uploaded[doc.key] ? '#10B981' : 'var(--c-muted)' }"
          >
            {{ uploaded[doc.key] ? t('uploaded') : t('required') }}
          </span>
        </button>
        <p v-if="errors.docs" class="text-xs font-semibold text-danger">{{ errors.docs }}</p>
      </div>

      <!-- Review -->
      <div v-else>
        <div
          class="mb-4 flex items-center gap-3 rounded-xl border px-4 py-3"
          style="background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2)"
        >
          <BaseIcon name="alert" :size="18" class="flex-none text-warning" />
          <span class="text-[13px] font-semibold text-text2">{{ t('willBeManual') }}</span>
        </div>
        <div class="mb-2.5 text-[12px] font-extrabold uppercase text-muted">{{ t('docRequired') }}</div>
        <div class="grid grid-cols-2 gap-2.5">
          <div
            v-for="doc in DOC_TYPES"
            :key="doc.key"
            class="flex items-center gap-2.5 rounded-[10px] border border-border px-3 py-2.5"
          >
            <BaseIcon
              :name="uploaded[doc.key] ? 'checkCircle' : 'clock'"
              :size="16"
              class="flex-none"
              :style="{ color: uploaded[doc.key] ? '#10B981' : 'var(--c-muted)' }"
            />
            <span class="flex-1 text-[12.5px] font-semibold">{{ L(doc.label) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-2 flex gap-3 border-t border-border px-[22px] pb-5 pt-3.5">
      <BaseButton v-if="step > 0" variant="secondary" size="lg" @click="back">{{ t('back') }}</BaseButton>
      <div class="flex-1" />
      <BaseButton v-if="step < STEPS.length - 1" size="lg" icon="arrowRight" icon-trailing @click="next">
        {{ t('next') }}
      </BaseButton>
      <BaseButton v-else variant="success" size="lg" icon="check" @click="create">{{ t('createDriver') }}</BaseButton>
    </div>
  </BaseModal>
</template>
