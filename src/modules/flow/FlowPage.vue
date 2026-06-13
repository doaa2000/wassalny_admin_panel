<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/core/composables/useI18n'
import { PALETTE } from '@/core/constants/palette'
import type { TranslationKey } from '@/core/constants/i18n'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import TableSkeleton from '@/shared/ui/TableSkeleton.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import ErrorState from '@/shared/ui/ErrorState.vue'

const { t } = useI18n()
const router = useRouter()

interface Node {
  icon: string
  titleKey: TranslationKey
  descKey: TranslationKey
  tint: keyof typeof PALETTE
}
const iaNodes: Node[] = [
  { icon: 'smartphone', titleKey: 'ia_app', descKey: 'ia_appDesc', tint: 'blue' },
  { icon: 'applications', titleKey: 'ia_apps', descKey: 'ia_appsDesc', tint: 'amber' },
  { icon: 'fileCheck', titleKey: 'ia_review', descKey: 'ia_reviewDesc', tint: 'indigo' },
  { icon: 'drivers', titleKey: 'ia_drivers', descKey: 'ia_driversDesc', tint: 'green' },
]
const iaSide: Node[] = [
  { icon: 'lock', titleKey: 'ia_manual', descKey: 'ia_manualDesc', tint: 'orange' },
  { icon: 'clock', titleKey: 'ia_audit', descKey: 'ia_auditDesc', tint: 'gray' },
]

const flowSteps: { icon: string; key: TranslationKey; tint: keyof typeof PALETTE }[] = [
  { icon: 'user', key: 'fn_register', tint: 'blue' },
  { icon: 'upload', key: 'fn_upload', tint: 'indigo' },
  { icon: 'send', key: 'fn_submit', tint: 'violet' },
  { icon: 'fileCheck', key: 'fn_review', tint: 'amber' },
]
const decisions: { icon: string; key: TranslationKey; tint: keyof typeof PALETTE }[] = [
  { icon: 'check', key: 'fn_approve', tint: 'green' },
  { icon: 'x', key: 'fn_reject', tint: 'red' },
  { icon: 'info', key: 'fn_reqinfo', tint: 'amber' },
]

const stateTabs: { key: 'data' | 'loading' | 'empty' | 'error'; labelKey: TranslationKey }[] = [
  { key: 'data', labelKey: 'stateData' },
  { key: 'loading', labelKey: 'stateLoading' },
  { key: 'empty', labelKey: 'stateEmpty' },
  { key: 'error', labelKey: 'stateError' },
]
const activeState = ref<'data' | 'loading' | 'empty' | 'error'>('data')

const sampleRows = computed(() => [
  { name: 'Kareem Fouad', meta: 'AP-301 · Comfort', label: t('pendingReview'), palette: PALETTE.amber },
  { name: 'Sameh Ramy', meta: 'AP-302 · Economy', label: t('pendingReview'), palette: PALETTE.amber },
  { name: 'Ramy Sobhy', meta: 'AP-305 · Economy', label: t('pendingReview'), palette: PALETTE.amber },
])
</script>

<template>
  <div class="max-w-[1180px] animate-fade">
    <PageHeader :title="t('flow')" :subtitle="t('flowSub')" />

    <!-- Hero -->
    <div
      class="mb-[22px] flex items-start gap-3.5 rounded-2xl border border-primary-soft2 px-[22px] py-[18px]"
      style="background: linear-gradient(120deg, var(--c-primary-soft), transparent)"
    >
      <div class="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[13px] bg-primary text-white shadow-glow">
        <BaseIcon name="flow" :size="22" />
      </div>
      <div class="flex-1">
        <div class="text-lg font-black">{{ t('flowTitle') }}</div>
        <div class="mt-1 max-w-[720px] text-[13.5px] leading-relaxed text-text2">{{ t('flowIntro') }}</div>
      </div>
      <BaseButton icon="arrowRight" icon-trailing @click="router.push({ name: 'applications' })">{{ t('goToApps') }}</BaseButton>
    </div>

    <!-- Information architecture -->
    <div class="mb-3 text-[12px] font-extrabold uppercase tracking-[1px] text-muted">{{ t('iaTitle') }}</div>
    <BaseCard class="mb-[26px]">
      <div class="flex flex-wrap items-stretch gap-2.5">
        <div v-for="(n, i) in iaNodes" :key="n.titleKey" class="flex min-w-[170px] flex-1 items-center gap-2.5">
          <div class="flex-1 rounded-[14px] border border-border bg-surface2 p-4">
            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-[11px]" :style="{ background: PALETTE[n.tint].b, color: PALETTE[n.tint].c }">
              <BaseIcon :name="n.icon" :size="20" />
            </div>
            <div class="text-sm font-extrabold">{{ t(n.titleKey) }}</div>
            <div class="mt-0.5 text-[12px] leading-snug text-muted">{{ t(n.descKey) }}</div>
          </div>
          <BaseIcon v-if="i < iaNodes.length - 1" name="chevRight" :size="18" class="flex-none text-muted" />
        </div>
      </div>
      <div class="mt-3.5 flex flex-wrap gap-3.5">
        <div
          v-for="n in iaSide"
          :key="n.titleKey"
          class="flex min-w-[230px] flex-1 items-center gap-3 rounded-[14px] border border-dashed border-border bg-surface2 px-4 py-3.5"
        >
          <div class="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px]" :style="{ background: PALETTE[n.tint].b, color: PALETTE[n.tint].c }">
            <BaseIcon :name="n.icon" :size="18" />
          </div>
          <div>
            <div class="text-[13.5px] font-extrabold">{{ t(n.titleKey) }}</div>
            <div class="mt-0.5 text-[12px] text-muted">{{ t(n.descKey) }}</div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- User flow -->
    <div class="mb-3 text-[12px] font-extrabold uppercase tracking-[1px] text-muted">{{ t('userFlowTitle') }}</div>
    <BaseCard class="mb-[26px]">
      <div class="mb-[22px] flex flex-wrap items-center gap-2.5">
        <template v-for="s in flowSteps" :key="s.key">
          <div class="flex items-center gap-2.5">
            <div class="flex items-center gap-2.5 rounded-xl px-3.5 py-3" :style="{ background: PALETTE[s.tint].b }">
              <BaseIcon :name="s.icon" :size="18" :style="{ color: PALETTE[s.tint].c }" />
              <span class="whitespace-nowrap text-[12.5px] font-bold">{{ t(s.key) }}</span>
            </div>
            <BaseIcon name="arrowRight" :size="18" class="flex-none text-muted" />
          </div>
        </template>
        <div class="flex items-center gap-2.5 rounded-xl bg-primary px-3.5 py-3">
          <BaseIcon name="flow" :size="18" class="text-white" />
          <span class="whitespace-nowrap text-[12.5px] font-extrabold text-white">{{ t('fn_decision') }}</span>
        </div>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
        <div
          v-for="d in decisions"
          :key="d.key"
          class="rounded-[14px] border border-border bg-surface2 p-4"
          :style="{ borderTop: `3px solid ${PALETTE[d.tint].c}` }"
        >
          <div class="flex items-center gap-2.5">
            <div class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px]" :style="{ background: PALETTE[d.tint].b }">
              <BaseIcon :name="d.icon" :size="18" :style="{ color: PALETTE[d.tint].c }" />
            </div>
            <span class="text-sm font-extrabold" :style="{ color: PALETTE[d.tint].c }">{{ t(d.key) }}</span>
          </div>
        </div>
      </div>
      <div
        class="mt-4 flex items-center gap-3 rounded-xl border px-4 py-3"
        style="background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2)"
      >
        <BaseIcon name="shield" :size="18" class="flex-none text-warning" />
        <div>
          <span class="text-[13px] font-extrabold">{{ t('preventAccident') }}</span>
          <span class="text-[13px] text-text2"> — {{ t('preventAccidentDesc') }}</span>
        </div>
      </div>
    </BaseCard>

    <!-- Interface states -->
    <div class="mb-3 text-[12px] font-extrabold uppercase tracking-[1px] text-muted">{{ t('statesTitle') }}</div>
    <BaseCard :padded="false">
      <div class="flex gap-1.5 border-b border-border px-[18px] py-3.5">
        <button
          v-for="tab in stateTabs"
          :key="tab.key"
          type="button"
          class="h-9 rounded-[9px] px-4 text-[13px] font-bold transition-colors"
          :class="activeState === tab.key ? 'bg-primary-soft text-primary' : 'text-text2 hover:bg-surface2'"
          @click="activeState = tab.key"
        >
          {{ t(tab.labelKey) }}
        </button>
      </div>
      <div class="min-h-[240px] bg-surface2 p-[22px]">
        <div v-if="activeState === 'data'" class="overflow-hidden rounded-[14px] border border-border bg-surface">
          <div
            v-for="(r, i) in sampleRows"
            :key="i"
            class="flex items-center gap-3 border-b border-border px-[18px] py-3.5 last:border-b-0"
          >
            <div class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-[12px] font-extrabold text-white">{{ r.name.slice(0, 1) }}</div>
            <div class="flex-1"><div class="text-[13.5px] font-bold">{{ r.name }}</div><div class="text-[12px] text-muted">{{ r.meta }}</div></div>
            <span class="rounded-full px-2.5 py-1 text-[11.5px] font-bold" :style="{ color: r.palette.c, background: r.palette.b }">{{ r.label }}</span>
          </div>
        </div>
        <TableSkeleton v-else-if="activeState === 'loading'" :rows="4" />
        <EmptyState v-else-if="activeState === 'empty'" icon="shieldCheck" :title="t('emptyAppsTitle')" :body="t('emptyAppsBody')" />
        <div v-else class="rounded-[14px] border border-border bg-surface"><ErrorState /></div>
      </div>
    </BaseCard>
  </div>
</template>
