<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'
import { env } from '@/core/config/env'
import { useI18n } from '@/core/composables/useI18n'
import { PALETTE } from '@/core/constants/palette'
import BaseIcon from '@/shared/ui/BaseIcon.vue'

const ui = useUiStore()
const auth = useAuthStore()
const { theme, locale } = storeToRefs(ui)
const { t } = useI18n()
const router = useRouter()

type Menu = 'notif' | 'profile' | null
const openMenu = ref<Menu>(null)
function toggle(menu: Exclude<Menu, null>) {
  openMenu.value = openMenu.value === menu ? null : menu
}
function closeMenus() {
  openMenu.value = null
}

const themeIcon = computed(() => (theme.value === 'light' ? 'moon' : 'sun'))
const langLabel = computed(() => (locale.value === 'en' ? 'EN' : 'ع'))

const notifFeed = computed(() => [
  { icon: 'applications', ...PALETTE.orange, titleKey: 'nt1t', bodyKey: 'nt1b', time: '5m' },
  { icon: 'complaints', ...PALETTE.red, titleKey: 'nt2t', bodyKey: 'nt2b', time: '22m' },
  { icon: 'wallet', ...PALETTE.green, titleKey: 'nt3t', bodyKey: 'nt3b', time: '1h' },
] as const)

const profileMenu = [
  { icon: 'user', labelKey: 'profile', danger: false },
  { icon: 'settings', labelKey: 'accountSettings', danger: false },
  { icon: 'logout', labelKey: 'signOut', danger: true },
] as const

async function onProfileItem(labelKey: string) {
  closeMenus()
  if (labelKey === 'profile' || labelKey === 'accountSettings') {
    router.push({ name: 'settings' })
  } else if (labelKey === 'signOut') {
    // In mock mode there is no session to end.
    if (env.useMock) return
    await auth.signOut()
    router.replace({ name: 'login' })
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-[25] flex h-[68px] flex-none items-center gap-3.5 border-b border-border bg-topbar px-6 backdrop-blur-[14px]"
  >
    <button
      type="button"
      class="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] border border-border bg-surface text-text2 hover:bg-surface2"
      @click="ui.toggleSidebar"
    >
      <BaseIcon name="menu" />
    </button>

    <!-- Search -->
    <div
      class="flex h-[42px] w-[340px] max-w-[38vw] items-center gap-2.5 rounded-[11px] border border-border bg-surface2 px-3.5"
    >
      <BaseIcon name="search" :size="18" class="text-muted" />
      <input
        :placeholder="t('searchPlaceholder')"
        class="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
      />
      <kbd class="rounded-[5px] border border-border px-1.5 py-px text-[11px] text-muted">⌘K</kbd>
    </div>

    <div class="flex-1" />

    <!-- Language -->
    <button
      type="button"
      class="flex h-[42px] items-center gap-[7px] rounded-[10px] border border-border bg-surface px-3.5 text-[13px] font-bold text-text2 hover:bg-surface2"
      @click="ui.toggleLocale"
    >
      <BaseIcon name="globe" :size="18" />
      <span>{{ langLabel }}</span>
    </button>

    <!-- Theme -->
    <button
      type="button"
      class="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-border bg-surface text-text2 hover:bg-surface2"
      @click="ui.toggleTheme"
    >
      <BaseIcon :name="themeIcon" :size="18" />
    </button>

    <!-- Notifications -->
    <div class="relative">
      <button
        type="button"
        class="relative flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-border bg-surface text-text2 hover:bg-surface2"
        @click="toggle('notif')"
      >
        <BaseIcon name="bell" :size="18" />
        <span
          class="absolute top-2 h-2 w-2 rounded-full border-2 border-surface bg-primary ltr:right-[9px] rtl:left-[9px]"
        />
      </button>
      <div
        v-if="openMenu === 'notif'"
        class="absolute top-[50px] z-40 w-[340px] animate-pop overflow-hidden rounded-xl border border-border bg-surface shadow-lg ltr:right-0 rtl:left-0"
      >
        <div class="flex items-center justify-between border-b border-border px-4 py-3.5">
          <span class="text-sm font-extrabold">{{ t('notifications') }}</span>
          <span class="cursor-pointer text-[11px] font-bold text-primary">{{ t('markAllRead') }}</span>
        </div>
        <div
          v-for="n in notifFeed"
          :key="n.titleKey"
          class="flex gap-[11px] border-b border-border px-4 py-3.5 last:border-b-0"
        >
          <div
            class="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px]"
            :style="{ background: n.b, color: n.c }"
          >
            <BaseIcon :name="n.icon" :size="17" />
          </div>
          <div class="min-w-0">
            <div class="text-[13px] font-bold">{{ t(n.titleKey) }}</div>
            <div class="mt-px text-[12px] text-text2">{{ t(n.bodyKey) }}</div>
            <div class="mt-0.5 text-[11px] text-muted">{{ n.time }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile -->
    <div class="relative">
      <button
        type="button"
        class="flex h-[42px] items-center gap-2 rounded-[10px] border border-border bg-surface py-0 ps-2 pe-1.5"
        @click="toggle('profile')"
      >
        <div
          class="flex h-[30px] w-[30px] items-center justify-center rounded-full text-[12px] font-extrabold text-white"
          style="background: linear-gradient(135deg, #6366f1, #8b5cf6)"
        >
          OA
        </div>
        <BaseIcon name="chevDown" :size="16" class="text-text" />
      </button>
      <div
        v-if="openMenu === 'profile'"
        class="absolute top-[50px] z-40 w-[240px] animate-pop overflow-hidden rounded-xl border border-border bg-surface shadow-lg ltr:right-0 rtl:left-0"
      >
        <div class="border-b border-border px-4 py-3.5">
          <div class="text-sm font-extrabold">{{ t('adminName') }}</div>
          <div class="text-[12px] text-muted" dir="ltr">admin@wasalny.eg</div>
        </div>
        <button
          v-for="m in profileMenu"
          :key="m.labelKey"
          type="button"
          class="flex w-full items-center gap-[11px] px-4 py-[11px] text-start text-[13.5px] font-semibold hover:bg-surface2"
          :class="m.danger ? 'text-danger' : 'text-text'"
          @click="onProfileItem(m.labelKey)"
        >
          <BaseIcon :name="m.icon" :size="18" />
          <span>{{ t(m.labelKey) }}</span>
        </button>
      </div>
    </div>

    <!-- Click-away backdrop for menus -->
    <div v-if="openMenu" class="fixed inset-0 z-[24]" @click="closeMenus" />
  </header>
</template>
