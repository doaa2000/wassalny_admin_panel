<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import { useI18n } from '@/core/composables/useI18n'
import type { TranslationKey } from '@/core/constants/i18n'

const route = useRoute()
const { t, isRtl } = useI18n()

const titleKey = computed(() => (route.meta.titleKey as TranslationKey) ?? 'dashboard')
const crumbSeparator = computed(() => (isRtl.value ? '‹' : '›'))
</script>

<template>
  <div class="flex min-h-screen w-full bg-bg text-text">
    <AppSidebar />
    <main class="flex min-w-0 flex-1 flex-col">
      <AppTopbar />
      <div class="flex-1 overflow-y-auto px-[30px] pb-[60px] pt-[26px]">
        <!-- Breadcrumb -->
        <div class="mb-[18px] flex items-center gap-2 text-[13px] font-semibold text-muted">
          <span>{{ t('home') }}</span>
          <span class="opacity-60">{{ crumbSeparator }}</span>
          <span class="font-bold text-text2">{{ t(titleKey) }}</span>
        </div>

        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
