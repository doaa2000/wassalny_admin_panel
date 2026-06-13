<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '@/core/composables/useI18n'
import type { TranslationKey } from '@/core/constants/i18n'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const { t } = useI18n()
const tabs: { key: string; labelKey: TranslationKey }[] = [
  { key: 'about', labelKey: 'aboutUs' },
  { key: 'privacy', labelKey: 'privacy' },
  { key: 'terms', labelKey: 'terms' },
  { key: 'faq', labelKey: 'faq' },
]
const activeTab = ref('about')
const body = ref('Wasalny connects riders with verified drivers across Egypt…')
const rteTools = ['B', 'I', 'U', 'H', '•', '🔗']
const activeLabel = computed(() => t(tabs.find((x) => x.key === activeTab.value)!.labelKey))
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('content')" :subtitle="t('contentSub')" />

    <BaseCard :padded="false">
      <!-- Tabs -->
      <div class="flex flex-wrap gap-1.5 border-b border-border px-[18px] py-3.5">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="h-10 rounded-[10px] px-[18px] text-[13.5px] font-bold transition-colors"
          :class="activeTab === tab.key ? 'bg-primary-soft text-primary' : 'text-text2 hover:bg-surface2'"
          @click="activeTab = tab.key"
        >
          {{ t(tab.labelKey) }}
        </button>
      </div>

      <!-- RTE toolbar -->
      <div class="flex items-center gap-2 border-b border-border px-[22px] py-2.5">
        <button
          v-for="tool in rteTools"
          :key="tool"
          type="button"
          class="h-9 w-9 rounded-[9px] border border-border bg-surface2 text-sm font-extrabold text-text2 hover:bg-surface"
        >
          {{ tool }}
        </button>
      </div>

      <!-- Editor -->
      <div class="p-[22px]">
        <div class="mb-3.5 text-lg font-extrabold">{{ activeLabel }}</div>
        <textarea
          v-model="body"
          class="min-h-[300px] w-full resize-y rounded-xl border border-border bg-surface2 p-4 text-[14.5px] leading-relaxed outline-none focus:border-primary"
        />
        <div class="mt-4 flex items-center justify-between">
          <span class="text-[12.5px] text-muted">{{ t('lastUpdated') }}: 2026-06-10</span>
          <BaseButton size="lg">{{ t('publish') }}</BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
