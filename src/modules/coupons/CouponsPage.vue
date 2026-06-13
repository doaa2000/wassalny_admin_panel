<script setup lang="ts">
import { computed, ref } from 'vue'
import { repositories } from '@/core/di/container'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useI18n } from '@/core/composables/useI18n'
import { PALETTE } from '@/core/constants/palette'
import { percentWidth } from '@/core/utils/format'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import ModalHeader from '@/shared/ui/ModalHeader.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'

const { t } = useI18n()
const { data } = useAsyncData(() => repositories().coupons.list())
const coupons = computed(() => data.value ?? [])
const createOpen = ref(false)

const stats = computed(() => [
  { value: String(coupons.value.filter((c) => c.status === 'active').length), label: t('activeCoupons'), tint: PALETTE.green, icon: 'percent' },
  { value: coupons.value.reduce((a, c) => a + c.used, 0).toLocaleString(), label: t('totalRedemptions'), tint: PALETTE.indigo, icon: 'trending' },
  { value: 'EGP 248K', label: t('couponRevenue'), tint: PALETTE.orange, icon: 'wallet' },
])

const typeOptions = computed(() => [
  { value: 'percent', label: t('percentOff') },
  { value: 'fixed', label: t('fixedAmt') },
])
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('coupons')" :subtitle="t('couponsSub')" />

    <div class="mb-[18px] grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
      <div v-for="s in stats" :key="s.label" class="flex items-center gap-3.5 rounded-2xl border border-border bg-surface p-5 shadow-card">
        <div class="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[13px]" :style="{ background: s.tint.b, color: s.tint.c }">
          <BaseIcon :name="s.icon" :size="22" />
        </div>
        <div>
          <div class="text-[22px] font-black leading-none">{{ s.value }}</div>
          <div class="mt-1 text-[12.5px] font-semibold text-text2">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <div class="mb-4 flex justify-end"><BaseButton icon="plus" @click="createOpen = true">{{ t('createCoupon') }}</BaseButton></div>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      <BaseCard v-for="c in coupons" :key="c.id" :padded="false">
        <div class="flex items-center gap-3 border-b border-dashed border-border p-4">
          <div class="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px] bg-primary-soft text-primary">
            <BaseIcon name="percent" :size="20" />
          </div>
          <div class="flex-1">
            <div class="font-mono text-base font-black tracking-wider">{{ c.code }}</div>
            <div class="text-[12px] text-muted">{{ t('expDate') }}: {{ c.exp }}</div>
          </div>
          <span class="rounded-full px-2.5 py-1 text-[12px] font-bold" :style="{ color: c.status === 'active' ? PALETTE.green.c : PALETTE.gray.c, background: c.status === 'active' ? PALETTE.green.b : PALETTE.gray.b }">
            {{ c.status === 'active' ? t('st_active') : t('st_closed') }}
          </span>
        </div>
        <div class="p-4">
          <div class="mb-3 flex items-baseline gap-2">
            <span class="text-[28px] font-black tracking-tight text-primary">{{ c.type === 'percent' ? `${c.value}%` : `EGP ${c.value}` }}</span>
            <span class="text-[13px] font-semibold text-muted">{{ t('discountVal') }}</span>
          </div>
          <div class="mb-1.5 flex items-center justify-between text-[12.5px] font-semibold text-text2">
            <span>{{ t('usage') }}</span><span>{{ c.used }} / {{ c.limit }}</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-surface2">
            <div class="h-full rounded-full" :style="{ width: percentWidth(c.used, c.limit), background: 'linear-gradient(90deg,#FB923C,#F97316)' }" />
          </div>
        </div>
      </BaseCard>
    </div>

    <BaseModal :open="createOpen" width="560px" @close="createOpen = false">
      <ModalHeader :title="t('createCoupon')" @close="createOpen = false" />
      <div class="grid grid-cols-2 gap-3.5 p-[22px]">
        <div class="col-span-2"><BaseInput :label="t('couponCode')" placeholder="WASALNY25" /></div>
        <BaseSelect :label="t('discountType')" :options="typeOptions" model-value="percent" />
        <BaseInput :label="t('discountVal')" placeholder="25" />
        <BaseInput :label="t('expDate')" placeholder="2026-07-31" />
        <BaseInput :label="t('usageLimit')" placeholder="5000" />
      </div>
      <div class="flex gap-3 px-[22px] pb-[22px]">
        <BaseButton variant="secondary" size="lg" block @click="createOpen = false">{{ t('cancel') }}</BaseButton>
        <BaseButton size="lg" block @click="createOpen = false">{{ t('createCoupon') }}</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
