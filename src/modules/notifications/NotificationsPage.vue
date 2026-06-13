<script setup lang="ts">
import { computed, ref } from 'vue'
import { repositories } from '@/core/di/container'
import { useAsyncData } from '@/core/composables/useAsyncData'
import { useI18n } from '@/core/composables/useI18n'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const { t, L } = useI18n()
const { data } = useAsyncData(() => repositories().notifications.history())
const history = computed(() => data.value ?? [])

const target = ref('all')
const title = ref('')
const message = ref('')

const targets = computed(() => [
  { value: 'all', label: t('allUsers'), icon: 'passengers' },
  { value: 'drivers', label: t('driversOnly'), icon: 'drivers' },
  { value: 'passengers', label: t('passengersOnly'), icon: 'user' },
  { value: 'specific', label: t('specificUser'), icon: 'userCheck' },
])
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('notifications')" :subtitle="t('notifScreenSub')" />
    <div class="grid grid-cols-1 gap-[18px] lg:grid-cols-[380px_1fr]">
      <!-- Composer -->
      <BaseCard class="self-start">
        <div class="text-base font-extrabold">{{ t('createNotif') }}</div>
        <div class="mb-[18px] mt-1 text-[13px] text-muted">{{ t('notifSub') }}</div>

        <div class="mb-2 text-[12.5px] font-bold text-text2">{{ t('target') }}</div>
        <div class="mb-[18px] grid grid-cols-2 gap-2.5">
          <button
            v-for="o in targets"
            :key="o.value"
            type="button"
            class="flex items-center gap-2 rounded-[11px] border-[1.5px] px-3 py-[11px] text-start text-[12.5px] font-bold transition-colors"
            :style="
              target === o.value
                ? { borderColor: 'var(--c-primary)', background: 'var(--c-primary-soft)', color: 'var(--c-primary)' }
                : { borderColor: 'var(--c-border)', background: 'var(--c-surface)', color: 'var(--c-text2)' }
            "
            @click="target = o.value"
          >
            <BaseIcon :name="o.icon" :size="16" /><span>{{ o.label }}</span>
          </button>
        </div>

        <div class="mb-2 text-[12.5px] font-bold text-text2">{{ t('title') }}</div>
        <input
          v-model="title"
          :placeholder="t('title')"
          class="mb-3.5 h-11 w-full rounded-[11px] border border-border bg-surface2 px-3.5 text-sm outline-none focus:border-primary"
        />
        <div class="mb-2 text-[12.5px] font-bold text-text2">{{ t('message') }}</div>
        <textarea
          v-model="message"
          rows="4"
          :placeholder="t('message')"
          class="mb-[18px] w-full resize-none rounded-[11px] border border-border bg-surface2 px-3.5 py-3 text-sm outline-none focus:border-primary"
        />
        <BaseButton block size="lg" icon="send">{{ t('sendNotif') }}</BaseButton>
      </BaseCard>

      <!-- History -->
      <BaseCard :padded="false" class="self-start">
        <div class="border-b border-border px-5 py-4 text-[15px] font-extrabold">{{ t('notifHistory') }}</div>
        <div
          v-for="(n, i) in history"
          :key="i"
          class="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-b-0"
        >
          <div class="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px] bg-primary-soft text-primary">
            <BaseIcon name="bell" :size="20" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-bold">{{ L(n.title) }}</div>
            <div class="text-[12px] text-muted">{{ n.target }} · {{ n.sent }}</div>
          </div>
          <div class="flex-none text-end">
            <div class="text-[13.5px] font-extrabold">{{ n.reach.toLocaleString() }}</div>
            <div class="text-[11.5px] font-bold text-success">{{ n.opened }}% {{ t('openRate') }}</div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
