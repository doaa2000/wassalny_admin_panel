<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Complaint } from '@/core/domain/entities'
import { repositories } from '@/core/di/container'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useI18n } from '@/core/composables/useI18n'
import { statusPalette } from '@/core/constants/palette'
import { avatarColor, initials } from '@/core/utils/avatar'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import IconButton from '@/shared/ui/IconButton.vue'
import TableSkeleton from '@/shared/ui/TableSkeleton.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const { t, L } = useI18n()
const { data, loading } = useAsyncData(() => repositories().complaints.list())
const complaints = computed(() => data.value ?? [])
const selected = ref<Complaint | null>(null)
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('complaints')" :subtitle="t('compSub')" />

    <TableSkeleton v-if="loading" :rows="6" />

    <BaseCard v-else :padded="false">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse" style="min-width: 760px">
          <thead>
            <tr class="bg-surface2">
              <th class="px-5 py-3.5 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('ticketId') }}</th>
              <th class="px-4 py-3.5 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('fullName') }}</th>
              <th class="px-4 py-3.5 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('complaintType') }}</th>
              <th class="px-4 py-3.5 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('priority') }}</th>
              <th class="px-4 py-3.5 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('statusCol') }}</th>
              <th class="px-5 py-3.5 text-end text-[12px] font-extrabold uppercase text-muted">{{ t('actionsCol') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in complaints" :key="c.id" class="border-t border-border">
              <td class="px-5 py-3.5 text-[13.5px] font-extrabold text-primary">{{ c.id }}</td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-2.5">
                  <div class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full text-[12px] font-extrabold text-white" :style="{ background: avatarColor(c.user.en) }">{{ initials(c.user.en) }}</div>
                  <span class="text-[13.5px] font-semibold">{{ L(c.user) }}</span>
                </div>
              </td>
              <td class="px-4 py-3.5 text-[13.5px] text-text2">{{ L(c.type) }}</td>
              <td class="px-4 py-3.5">
                <span class="rounded-full px-2.5 py-1 text-[12px] font-bold" :style="{ color: statusPalette(c.priority).c, background: statusPalette(c.priority).b }">{{ t(`pr_${c.priority}`) }}</span>
              </td>
              <td class="px-4 py-3.5">
                <span class="rounded-full px-2.5 py-1 text-[12px] font-bold" :style="{ color: statusPalette(c.status).c, background: statusPalette(c.status).b }">{{ t(`st_${c.status}`) }}</span>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex justify-end gap-1.5">
                  <IconButton icon="eye" @click="selected = c" />
                  <IconButton icon="reply" @click="selected = c" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <!-- Ticket modal -->
    <BaseModal :open="selected !== null" width="560px" @close="selected = null">
      <template v-if="selected">
        <div class="flex items-center justify-between border-b border-border p-[22px]">
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-extrabold text-white" :style="{ background: avatarColor(selected.user.en) }">{{ initials(selected.user.en) }}</div>
            <div>
              <div class="text-base font-black">{{ L(selected.user) }}</div>
              <div class="text-[12.5px] text-muted">{{ selected.id }} · {{ L(selected.type) }}</div>
            </div>
          </div>
          <button type="button" class="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-border bg-surface" @click="selected = null">
            <BaseIcon name="close" :size="18" />
          </button>
        </div>
        <div class="p-[22px]">
          <div class="mb-4 flex gap-2.5">
            <span class="rounded-full px-3 py-[5px] text-[12px] font-bold" :style="{ color: statusPalette(selected.priority).c, background: statusPalette(selected.priority).b }">{{ t(`pr_${selected.priority}`) }}</span>
            <span class="rounded-full px-3 py-[5px] text-[12px] font-bold" :style="{ color: statusPalette(selected.status).c, background: statusPalette(selected.status).b }">{{ t(`st_${selected.status}`) }}</span>
          </div>
          <div class="mb-4 rounded-xl bg-surface2 p-4 text-[13.5px] leading-relaxed text-text2">{{ L(selected.type) }} — {{ L(selected.user) }}.</div>
          <textarea
            rows="3"
            :placeholder="`${t('reply')}…`"
            class="mb-3.5 w-full resize-none rounded-[11px] border border-border bg-surface2 px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
          <div class="flex gap-3">
            <BaseButton block size="lg" icon="send" @click="selected = null">{{ t('sendReply') }}</BaseButton>
            <BaseButton variant="secondary" size="lg" @click="selected = null"><span class="text-success">{{ t('markResolved') }}</span></BaseButton>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
