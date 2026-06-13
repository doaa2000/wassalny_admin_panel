<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Review } from '@/core/domain/entities'
import { repositories } from '@/core/di/container'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useI18n } from '@/core/composables/useI18n'
import { avatarColor, initials } from '@/core/utils/avatar'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import StarRating from '@/shared/ui/StarRating.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'
import TableSkeleton from '@/shared/ui/TableSkeleton.vue'
import ConfirmModal from '@/shared/modals/ConfirmModal.vue'

const { t, L } = useI18n()
const repo = repositories().reviews
const { data, loading } = useAsyncData(() => repo.list())
const reviews = computed(() => data.value ?? [])

const toDelete = ref<Review | null>(null)
async function confirmDelete() {
  if (toDelete.value && data.value) {
    await repo.remove(toDelete.value.id)
    data.value = data.value.filter((r) => r.id !== toDelete.value!.id)
  }
  toDelete.value = null
}
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('ratings')" :subtitle="t('ratingsSub')" />

    <TableSkeleton v-if="loading" :rows="6" />

    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-4">
      <div
        v-for="r in reviews"
        :key="r.id"
        class="rounded-2xl border bg-surface p-5 shadow-card"
        :style="{ borderColor: r.flagged ? 'rgba(239,68,68,.35)' : 'var(--c-border)' }"
      >
        <div class="mb-3 flex items-center gap-3">
          <div class="flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-extrabold text-white" :style="{ background: avatarColor(r.by.en) }">{{ initials(r.by.en) }}</div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-bold">{{ L(r.by) }}</div>
            <div class="text-[12px] text-muted">{{ r.role === 'driver' ? t('forDriver') : t('forPassenger') }} {{ L(r.target) }}</div>
          </div>
          <span
            v-if="r.flagged"
            class="inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-bold text-danger"
            style="background: rgba(239, 68, 68, 0.12)"
          >
            <BaseIcon name="alert" :size="12" />{{ t('flagged') }}
          </span>
        </div>
        <div class="mb-2.5"><StarRating :rating="r.rating" /></div>
        <p class="m-0 text-[13.5px] leading-relaxed text-text2">{{ L(r.text) }}</p>
        <div class="mt-3.5 flex items-center justify-between border-t border-border pt-3">
          <span class="text-[12px] text-muted">{{ r.date }}</span>
          <BaseButton variant="secondary" size="sm" icon="trash" @click="toDelete = r">
            <span class="text-danger">{{ t('del') }}</span>
          </BaseButton>
        </div>
      </div>
    </div>

    <ConfirmModal
      :open="toDelete !== null"
      :title="t('confirmDelete')"
      :subtitle="t('confirmDeleteSub')"
      :confirm-label="t('del')"
      danger
      icon="trash"
      @close="toDelete = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
