<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { PricingPlan } from '@/core/domain/entities'
import { repositories } from '@/core/di/container'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useI18n } from '@/core/composables/useI18n'
import { VEHICLE_TYPES } from '@/core/constants/localized'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import IconButton from '@/shared/ui/IconButton.vue'
import TableSkeleton from '@/shared/ui/TableSkeleton.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import ModalHeader from '@/shared/ui/ModalHeader.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const { t, L } = useI18n()
const { data, loading } = useAsyncData(() => repositories().pricing.list())
const plans = computed(() => data.value ?? [])

const editing = ref<PricingPlan | null>(null)
const form = reactive({ base: '', km: '', service: '', minp: '' })

function openEdit(plan: PricingPlan) {
  editing.value = plan
  form.base = String(plan.base)
  form.km = String(plan.km)
  form.service = String(plan.service)
  form.minp = String(plan.minp)
}
function save() {
  if (editing.value && data.value) {
    data.value = data.value.map((p) =>
      p.vt === editing.value!.vt
        ? { ...p, base: +form.base, km: +form.km, service: +form.service, minp: +form.minp }
        : p,
    )
  }
  editing.value = null
}

const rows = (p: PricingPlan) => [
  { label: t('baseFare'), value: p.base },
  { label: t('perKm'), value: p.km },
  { label: t('perMin'), value: p.min },
  { label: t('serviceFee'), value: p.service },
]
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('pricing')" :subtitle="t('pricingSub')" />

    <TableSkeleton v-if="loading" :rows="4" />

    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
      <BaseCard v-for="p in plans" :key="p.vt" :padded="false">
        <div class="flex items-center gap-3 border-b border-border p-5">
          <div class="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[13px] bg-primary-soft text-primary">
            <BaseIcon name="car" :size="22" />
          </div>
          <div class="flex-1 text-base font-extrabold">{{ L(VEHICLE_TYPES[p.vt]) }}</div>
          <IconButton icon="edit" @click="openEdit(p)" />
        </div>
        <div class="px-5 pb-4 pt-2">
          <div
            v-for="(row, i) in rows(p)"
            :key="i"
            class="flex items-center justify-between border-b border-border py-3 last:border-b-0"
          >
            <span class="text-[13.5px] font-semibold text-text2">{{ row.label }}</span>
            <span class="text-sm font-extrabold">EGP {{ row.value }}</span>
          </div>
          <div class="flex items-center justify-between py-3">
            <span class="text-[13.5px] font-semibold text-text2">{{ t('minPrice') }}</span>
            <span class="text-sm font-extrabold text-primary">EGP {{ p.minp }}</span>
          </div>
        </div>
      </BaseCard>
    </div>

    <BaseModal :open="editing !== null" width="560px" @close="editing = null">
      <ModalHeader :title="`${t('editPricing')} · ${editing ? L(VEHICLE_TYPES[editing.vt]) : ''}`" @close="editing = null" />
      <div class="grid grid-cols-2 gap-3.5 p-[22px]">
        <BaseInput v-model="form.base" :label="t('baseFare')" />
        <BaseInput v-model="form.km" :label="t('perKm')" />
        <BaseInput v-model="form.service" :label="t('serviceFee')" />
        <BaseInput v-model="form.minp" :label="t('minPrice')" />
      </div>
      <div class="flex gap-3 px-[22px] pb-[22px]">
        <BaseButton variant="secondary" size="lg" block @click="editing = null">{{ t('cancel') }}</BaseButton>
        <BaseButton size="lg" block @click="save">{{ t('saveChanges') }}</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
