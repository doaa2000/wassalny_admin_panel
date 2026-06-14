<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')

async function submit() {
  const ok = await auth.signIn(email.value.trim(), password.value)
  if (ok) {
    const redirect = (router.currentRoute.value.query.redirect as string) || '/dashboard'
    void router.replace(redirect)
  }
}
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-bg px-4">
    <form
      class="w-full max-w-[380px] rounded-2xl border border-border bg-surface p-7 shadow-glow"
      @submit.prevent="submit"
    >
      <div class="mb-6 text-center">
        <div
          class="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-xl font-black text-white"
        >
          W
        </div>
        <h1 class="text-xl font-extrabold text-text">Wassalny Admin</h1>
        <p class="mt-1 text-[13px] text-text2">Sign in to the admin console</p>
      </div>

      <div class="space-y-3">
        <BaseInput v-model="email" label="Email" type="email" placeholder="admin@wassalny.com" ltr />
        <BaseInput v-model="password" label="Password" type="password" placeholder="••••••••" ltr />
      </div>

      <p v-if="auth.error" class="mt-3 text-[13px] font-semibold text-danger">{{ auth.error }}</p>

      <BaseButton type="submit" block class="mt-5" :disabled="auth.loading">
        {{ auth.loading ? 'Signing in…' : 'Sign in' }}
      </BaseButton>
    </form>
  </div>
</template>
