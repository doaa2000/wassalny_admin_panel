<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { DriverApplication } from '@/core/domain/entities'
import { useApplicationsStore } from '@/stores/applications.store'
import { useI18n } from '@/core/composables/useI18n'
import { VEHICLE_TYPES, CITIES } from '@/core/constants/localized'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import AvatarBadge from '@/shared/ui/AvatarBadge.vue'
import TableSkeleton from '@/shared/ui/TableSkeleton.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import ReviewDrawer from './components/ReviewDrawer.vue'

const { t, L } = useI18n()
const store = useApplicationsStore()
const { applications, loading, error } = storeToRefs(store)

onMounted(() => store.load())

const reviewing = ref<DriverApplication | null>(null)
const isEmpty = computed(() => !loading.value && !error.value && applications.value.length === 0)

async function approve(id: string) {
  await store.approve(id)
  reviewing.value = null
}
async function reject(id: string) {
  await store.reject(id)
  reviewing.value = null
}
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('applications')" :subtitle="t('appsSub')" />

    <!-- Banner -->
    <div
      class="mb-[18px] flex items-center gap-3 rounded-[13px] border border-primary-soft2 bg-primary-soft px-4 py-3"
    >
      <BaseIcon name="applications" :size="18" class="flex-none text-primary" />
      <span class="flex-1 text-[13px] font-semibold text-text2">{{ t('appsBanner') }}</span>
      <span
        class="flex-none rounded-full border border-primary-soft2 bg-surface px-3 py-[5px] text-[12px] font-extrabold text-primary"
      >
        {{ applications.length }} {{ t('pendingReview') }}
      </span>
    </div>

    <TableSkeleton v-if="loading" :rows="6" />

    <EmptyState v-else-if="isEmpty" icon="shieldCheck" :title="t('emptyAppsTitle')" :body="t('emptyAppsBody')" />

    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-4">
      <BaseCard v-for="app in applications" :key="app.id" :padded="false">
        <div class="flex items-center gap-3 border-b border-border p-4">
          <AvatarBadge :name="app.name.en" :size="44" />
          <div class="min-w-0 flex-1">
            <div class="text-[15px] font-extrabold">{{ L(app.name) }}</div>
            <div class="text-[12px] text-muted">{{ app.id }} · {{ app.submitted }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 p-4">
          <div>
            <div class="text-[11px] font-bold text-muted">{{ t('vehicleType') }}</div>
            <div class="text-[13px] font-bold">{{ L(VEHICLE_TYPES[app.vt]) }}</div>
          </div>
          <div>
            <div class="text-[11px] font-bold text-muted">{{ t('cityCol') }}</div>
            <div class="text-[13px] font-bold">{{ L(CITIES[app.city]) }}</div>
          </div>
        </div>
        <div class="px-4 pb-4">
          <BaseButton block icon="eye" @click="reviewing = app">{{ t('view') }} · {{ t('uploadedDocs') }}</BaseButton>
        </div>
      </BaseCard>
    </div>

    <ReviewDrawer :application="reviewing" @close="reviewing = null" @approve="approve" @reject="reject" />
  </div>
</template>
