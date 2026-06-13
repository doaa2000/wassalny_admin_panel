import type {
  Driver,
  DriverApplication,
  DriverStatus,
  Passenger,
  PassengerStatus,
} from '@/core/domain/entities'
import { getSupabaseClient } from '@/core/config/supabase'
import type { DriverDataSource, ApplicationDataSource, PassengerDataSource } from './contracts'

/**
 * Example Supabase-backed data sources.
 *
 * These are intentionally thin: they translate domain operations into Supabase
 * queries and map rows back to domain entities. The rest of the application is
 * unaware Supabase exists. Swapping to a REST/Laravel/Node backend means writing
 * a sibling implementation of the same contract — no UI changes required.
 *
 * NOTE: these assume tables named `drivers`, `driver_applications`,
 * `passengers` with the columns referenced below. They are provided as a
 * production-ready integration point; the app ships in mock mode by default.
 */

export class SupabaseDriverDataSource implements DriverDataSource {
  private get db() {
    return getSupabaseClient()
  }

  async fetchAll(): Promise<Driver[]> {
    const { data, error } = await this.db.from('drivers').select('*').order('joined', { ascending: false })
    if (error) throw error
    return (data ?? []) as Driver[]
  }

  async updateStatus(id: string, status: DriverStatus): Promise<Driver> {
    const { data, error } = await this.db.from('drivers').update({ status }).eq('id', id).select().single()
    if (error) throw error
    return data as Driver
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from('drivers').delete().eq('id', id)
    if (error) throw error
  }

  async insert(driver: Driver): Promise<Driver> {
    const { data, error } = await this.db.from('drivers').insert(driver).select().single()
    if (error) throw error
    return data as Driver
  }
}

export class SupabaseApplicationDataSource implements ApplicationDataSource {
  private get db() {
    return getSupabaseClient()
  }

  async fetchAll(): Promise<DriverApplication[]> {
    const { data, error } = await this.db
      .from('driver_applications')
      .select('*')
      .eq('status', 'review')
      .order('submitted', { ascending: false })
    if (error) throw error
    return (data ?? []) as DriverApplication[]
  }

  async approve(id: string): Promise<void> {
    const { error } = await this.db.rpc('approve_driver_application', { application_id: id })
    if (error) throw error
  }

  async reject(id: string): Promise<void> {
    const { error } = await this.db.from('driver_applications').update({ status: 'rejected' }).eq('id', id)
    if (error) throw error
  }
}

export class SupabasePassengerDataSource implements PassengerDataSource {
  private get db() {
    return getSupabaseClient()
  }

  async fetchAll(): Promise<Passenger[]> {
    const { data, error } = await this.db.from('passengers').select('*')
    if (error) throw error
    return (data ?? []) as Passenger[]
  }

  async updateStatus(id: string, status: PassengerStatus): Promise<Passenger> {
    const { data, error } = await this.db.from('passengers').update({ status }).eq('id', id).select().single()
    if (error) throw error
    return data as Passenger
  }
}
