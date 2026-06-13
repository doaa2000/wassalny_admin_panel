import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Driver, DriverStatus } from '@/core/domain/entities'
import { repositories } from '@/core/di/container'

/**
 * Drivers store — orchestrates the driver repository and keeps a reactive cache
 * the UI binds to. All backend access flows through the injected repository.
 */
export const useDriversStore = defineStore('drivers', () => {
  const repo = repositories().drivers
  const audit = repositories().audit

  const drivers = ref<Driver[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      drivers.value = await repo.list()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      loading.value = false
    }
  }

  async function setStatus(id: string, status: DriverStatus) {
    const updated = await repo.setStatus(id, status)
    drivers.value = drivers.value.map((d) => (d.id === id ? updated : d))
    await audit.record({
      admin: { en: 'Omar Adel', ar: 'عمر عادل' },
      action:
        status === 'suspended'
          ? { en: 'Suspended driver', ar: 'إيقاف سائق' }
          : { en: 'Reactivated driver', ar: 'إعادة تفعيل سائق' },
      target: id,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
    })
  }

  async function remove(id: string) {
    await repo.remove(id)
    drivers.value = drivers.value.filter((d) => d.id !== id)
  }

  async function createManual(driver: Driver) {
    const created = await repo.create(driver)
    drivers.value = [created, ...drivers.value]
    await audit.record({
      admin: { en: 'Omar Adel', ar: 'عمر عادل' },
      action: { en: 'Added driver manually', ar: 'إضافة سائق يدويًا' },
      target: created.id,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
    })
  }

  return { drivers, loading, error, load, setStatus, remove, createManual }
})
