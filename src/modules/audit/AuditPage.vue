<script setup lang="ts">
import { computed } from 'vue'
import type { AuditEntry } from '@/core/domain/entities'
import { repositories } from '@/core/di/container'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useI18n } from '@/core/composables/useI18n'
import { useDataTable } from '@/core/composables/useDataTable'
import { avatarColor, initials } from '@/core/utils/avatar'
import type { Column } from '@/shared/tables/DataTable.vue'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import DataTable from '@/shared/tables/DataTable.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'

const { t, L } = useI18n()
const { data, loading, error, refresh } = useAsyncData(() => repositories().audit.list())
const entries = computed(() => data.value ?? [])

const table = useDataTable<AuditEntry>({
  source: entries,
  searchFields: [(a) => `${a.admin.en} ${a.action.en} ${a.target}`],
  pageSize: 10,
})

const columns: Column[] = [
  { key: 'admin', label: t('adminName2') },
  { key: 'action', label: t('actionCol') },
  { key: 'target', label: t('targetCol') },
  { key: 'date', label: t('dateCol'), sortable: true },
  { key: 'time', label: t('timeCol') },
]
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('audit')" :subtitle="t('auditSub')" />

    <div class="mb-[18px] flex gap-3">
      <div class="max-w-[360px] flex-1"><BaseInput v-model="table.query.value" icon="search" :placeholder="t('search')" /></div>
    </div>

    <DataTable
      :columns="columns"
      :rows="table.paged.value"
      :total="table.total.value"
      :page="table.page.value"
      :page-count="table.pageCount.value"
      :loading="loading"
      :error="error"
      :is-empty="!loading && !error && table.total.value === 0"
      :sort-key="table.sortKey.value as string"
      :sort-dir="table.sortDir.value"
      :min-width="680"
      @update:page="table.page.value = $event"
      @sort="table.toggleSort($event as keyof AuditEntry)"
      @retry="refresh"
    >
      <template #row="{ row }: { row: AuditEntry }">
        <td class="px-5 py-3.5">
          <div class="flex items-center gap-2.5">
            <div class="flex h-8 w-8 flex-none items-center justify-center rounded-full text-[11px] font-extrabold text-white" :style="{ background: avatarColor(row.admin.en) }">{{ initials(row.admin.en) }}</div>
            <span class="text-[13.5px] font-bold">{{ L(row.admin) }}</span>
          </div>
        </td>
        <td class="px-4 py-3.5 text-[13.5px] text-text2">{{ L(row.action) }}</td>
        <td class="px-4 py-3.5">
          <span class="rounded-md bg-primary-soft px-2 py-[3px] font-mono text-[12px] font-bold text-primary">{{ row.target }}</span>
        </td>
        <td class="px-4 py-3.5 text-[13px] text-muted">{{ row.date }}</td>
        <td class="px-5 py-3.5 text-[13px] text-muted">{{ row.time }}</td>
      </template>
    </DataTable>
  </div>
</template>
