<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from '@/core/composables/useI18n'
import PageHeader from '@/shared/layouts/PageHeader.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseToggle from '@/shared/ui/BaseToggle.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const { t } = useI18n()

const general = reactive({ platform: 'Wasalny وصلني', email: 'support@wasalny.eg', currency: 'EGP — Egyptian Pound' })
const toggles = reactive({ maintenance: false, push: true, email: true, twoFa: true })
const commission = ref(20)
</script>

<template>
  <div class="animate-fade">
    <PageHeader :title="t('settings')" :subtitle="t('settingsSub')" />

    <div class="grid max-w-[980px] grid-cols-1 gap-[18px] md:grid-cols-2">
      <!-- General -->
      <BaseCard>
        <div class="mb-[18px] text-[15px] font-extrabold">{{ t('general') }}</div>
        <div class="flex flex-col gap-3.5">
          <BaseInput v-model="general.platform" :label="t('platformName')" />
          <BaseInput v-model="general.email" :label="t('supportEmail')" ltr />
          <BaseInput v-model="general.currency" :label="t('currency')" />
        </div>
        <div class="mt-4 border-t border-border pt-4">
          <BaseToggle v-model="toggles.maintenance" :label="t('maintenance')" />
        </div>
      </BaseCard>

      <!-- Commission -->
      <BaseCard>
        <div class="mb-[18px] text-[15px] font-extrabold">{{ t('commissionSet') }}</div>
        <div class="py-3.5 pb-5 text-center">
          <div class="text-[48px] font-black tracking-tighter text-primary">{{ commission }}%</div>
          <div class="text-[13px] font-semibold text-muted">{{ t('commissionRate') }}</div>
        </div>
        <input v-model.number="commission" type="range" min="0" max="40" class="w-full" style="accent-color: #f97316" />
        <div class="mt-1 flex justify-between text-[11.5px] text-muted"><span>0%</span><span>40%</span></div>
      </BaseCard>

      <!-- Notifications -->
      <BaseCard>
        <div class="mb-3.5 text-[15px] font-extrabold">{{ t('notifSet') }}</div>
        <div class="border-b border-border py-3"><BaseToggle v-model="toggles.push" :label="t('pushEnabled')" /></div>
        <div class="py-3"><BaseToggle v-model="toggles.email" :label="t('emailNotif')" /></div>
      </BaseCard>

      <!-- Security -->
      <BaseCard>
        <div class="mb-3.5 text-[15px] font-extrabold">{{ t('security') }}</div>
        <div class="border-b border-border py-3"><BaseToggle v-model="toggles.twoFa" :label="t('twoFa')" /></div>
        <BaseButton variant="secondary" size="lg" block class="mt-3.5">{{ t('changePassword') }}</BaseButton>
      </BaseCard>
    </div>
  </div>
</template>
