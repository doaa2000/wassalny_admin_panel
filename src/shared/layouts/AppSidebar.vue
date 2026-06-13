<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { NAV_GROUPS } from '@/core/constants/navigation'
import { useI18n } from '@/core/composables/useI18n'
import { useUiStore } from '@/stores/ui.store'
import type { TranslationKey } from '@/core/constants/i18n'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const ui = useUiStore()
const { sidebarCollapsed } = storeToRefs(ui)
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const isActive = (key: string) => route.name === key
</script>

<template>
  <aside
    class="sticky top-0 z-30 flex h-screen flex-none flex-col border-border bg-sidebar transition-[width] duration-200 ltr:border-r rtl:border-l"
    :style="{ width: sidebarCollapsed ? '78px' : '264px' }"
  >
    <!-- Brand -->
    <div class="flex h-[68px] flex-none items-center gap-3 border-b border-border px-[18px]">
      <div
        class="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px] text-white shadow-glow"
        style="background: linear-gradient(135deg, #fb923c, #f97316)"
      >
        <BaseIcon name="car" :size="20" />
      </div>
      <div v-if="!sidebarCollapsed" class="min-w-0 flex-1">
        <div class="text-[17px] font-black leading-none tracking-tight">Wasalny</div>
        <div class="mt-0.5 text-[11px] font-medium text-muted">{{ t('tagline') }}</div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden p-3">
      <template v-for="group in NAV_GROUPS" :key="group.label">
        <div
          v-if="!sidebarCollapsed"
          class="px-3 pb-1.5 pt-3.5 text-[10.5px] font-extrabold uppercase tracking-[1px] text-muted"
        >
          {{ t(group.label as TranslationKey) }}
        </div>
        <button
          v-for="item in group.items"
          :key="item.key"
          type="button"
          :title="t(item.key as TranslationKey)"
          class="relative flex w-full items-center gap-[13px] rounded-[10px] px-3 py-2.5 text-start text-sm transition-colors"
          :class="
            isActive(item.key)
              ? 'bg-primary-soft font-extrabold text-primary'
              : 'font-semibold text-text2 hover:bg-surface2'
          "
          @click="router.push({ name: item.key })"
        >
          <span class="flex flex-none">
            <BaseIcon
              :name="item.icon"
              :size="20"
              :stroke-width="isActive(item.key) ? 2 : 1.8"
            />
          </span>
          <span v-if="!sidebarCollapsed" class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {{ t(item.key as TranslationKey) }}
          </span>
          <span
            v-if="item.badge && !sidebarCollapsed"
            class="flex-none rounded-full bg-primary px-[7px] py-px text-[10.5px] font-extrabold text-white"
          >
            {{ item.badge }}
          </span>
        </button>
      </template>
    </nav>

    <!-- Admin chip -->
    <div class="flex-none border-t border-border p-3">
      <div class="flex items-center gap-[11px] rounded-[11px] bg-surface2 px-2.5 py-2">
        <div
          class="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[13px] font-extrabold text-white"
          style="background: linear-gradient(135deg, #6366f1, #8b5cf6)"
        >
          OA
        </div>
        <div v-if="!sidebarCollapsed" class="min-w-0 flex-1">
          <div class="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold">
            {{ t('adminName') }}
          </div>
          <div class="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-muted">
            {{ t('superAdmin') }}
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
