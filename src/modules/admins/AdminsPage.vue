<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdminRole } from '@/core/domain/entities'
import { repositories } from '@/core/di/container'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useI18n } from '@/core/composables/useI18n'
import { PALETTE } from '@/core/constants/palette'
import { avatarColor, initials } from '@/core/utils/avatar'
import type { TranslationKey } from '@/core/constants/i18n'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import IconButton from '@/shared/ui/IconButton.vue'
import StatusPill from '@/shared/ui/StatusPill.vue'
import TableSkeleton from '@/shared/ui/TableSkeleton.vue'
import BaseModal from '@/shared/ui/BaseModal.vue'
import ModalHeader from '@/shared/ui/ModalHeader.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseSelect from '@/shared/ui/BaseSelect.vue'

const { t, L } = useI18n()
const { data, loading } = useAsyncData(() => repositories().admins.list())
const admins = computed(() => data.value ?? [])
const createOpen = ref(false)

const roleMeta: Record<AdminRole, { key: TranslationKey; palette: keyof typeof PALETTE }> = {
  super: { key: 'roleSuper', palette: 'orange' },
  ops: { key: 'roleOps', palette: 'indigo' },
  support: { key: 'roleSupport', palette: 'blue' },
  finance: { key: 'roleFinance', palette: 'teal' },
}

const roleOptions = computed(() => [
  { value: 'super', label: t('superAdminR') },
  { value: 'ops', label: t('opsManager') },
  { value: 'support', label: t('supportAgent') },
  { value: 'finance', label: t('financeManager') },
])
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('admins')" :subtitle="t('adminsSub')" />

    <div class="mb-4 flex justify-end"><BaseButton icon="plus" @click="createOpen = true">{{ t('createAdmin') }}</BaseButton></div>

    <TableSkeleton v-if="loading" :rows="5" />

    <BaseCard v-else :padded="false">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse" style="min-width: 720px">
          <thead>
            <tr class="bg-surface2">
              <th class="px-5 py-3.5 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('fullName') }}</th>
              <th class="px-4 py-3.5 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('emailCol') }}</th>
              <th class="px-4 py-3.5 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('roleCol') }}</th>
              <th class="px-4 py-3.5 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('statusCol') }}</th>
              <th class="px-4 py-3.5 text-start text-[12px] font-extrabold uppercase text-muted">{{ t('lastActive') }}</th>
              <th class="px-5 py-3.5 text-end text-[12px] font-extrabold uppercase text-muted">{{ t('actionsCol') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in admins" :key="a.id" class="border-t border-border">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2.5">
                  <div class="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full text-[13px] font-extrabold text-white" :style="{ background: avatarColor(a.name.en) }">{{ initials(a.name.en) }}</div>
                  <span class="text-sm font-bold">{{ L(a.name) }}</span>
                </div>
              </td>
              <td class="px-4 py-3.5 text-start text-[13px] text-text2" dir="ltr">{{ a.email }}</td>
              <td class="px-4 py-3.5">
                <span class="rounded-full px-2.5 py-1 text-[12px] font-bold" :style="{ color: PALETTE[roleMeta[a.role].palette].c, background: PALETTE[roleMeta[a.role].palette].b }">
                  {{ t(roleMeta[a.role].key) }}
                </span>
              </td>
              <td class="px-4 py-3.5"><StatusPill :status="a.status" :label="t(`st_${a.status}`)" :dot="false" /></td>
              <td class="px-4 py-3.5 text-[13px] text-muted">{{ a.last }}</td>
              <td class="px-5 py-3.5">
                <div class="flex justify-end gap-1.5">
                  <IconButton icon="edit" />
                  <IconButton icon="trash" :color="PALETTE.red.c" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>

    <BaseModal :open="createOpen" width="520px" @close="createOpen = false">
      <ModalHeader :title="t('createAdmin')" @close="createOpen = false" />
      <div class="flex flex-col gap-3.5 p-[22px]">
        <BaseInput :label="t('fullName')" />
        <BaseInput :label="t('emailCol')" ltr />
        <BaseSelect :label="t('assignRole')" :options="roleOptions" model-value="ops" />
      </div>
      <div class="flex gap-3 px-[22px] pb-[22px]">
        <BaseButton variant="secondary" size="lg" block @click="createOpen = false">{{ t('cancel') }}</BaseButton>
        <BaseButton size="lg" block @click="createOpen = false">{{ t('save') }}</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>
