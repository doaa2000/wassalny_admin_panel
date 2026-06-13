import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DriverApplication } from '@/core/domain/entities'
import { repositories } from '@/core/di/container'

/** Driver-application review queue store. */
export const useApplicationsStore = defineStore('applications', () => {
  const repo = repositories().applications

  const applications = ref<DriverApplication[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      applications.value = await repo.list()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      loading.value = false
    }
  }

  async function approve(id: string) {
    await repo.approve(id)
    applications.value = applications.value.filter((a) => a.id !== id)
  }

  async function reject(id: string) {
    await repo.reject(id)
    applications.value = applications.value.filter((a) => a.id !== id)
  }

  return { applications, loading, error, load, approve, reject }
})
