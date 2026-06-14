import type {
  DocStatus,
  DocumentMap,
  Driver,
  DriverApplication,
  DriverStatus,
  Passenger,
  PassengerStatus,
} from '@/core/domain/entities'
import type { Localized } from '@/core/constants/localized'
import { getSupabaseClient } from '@/core/config/supabase'
import type { DriverDataSource, ApplicationDataSource, PassengerDataSource } from './contracts'

/**
 * Supabase-backed data sources mapped to the Wassalny production schema
 * (profiles / drivers / driver_documents / trips). Each method translates the
 * relational rows into the panel's domain entities. This is the ONLY layer
 * aware of table/column names; repositories and UI stay backend-agnostic.
 *
 * Requires an authenticated admin session (RLS `public.is_admin()`).
 */

interface DriverRow {
  profile_id: string
  vehicle_type: string
  plate_number: string | null
  approval_status: 'pending' | 'approved' | 'rejected' | 'suspended'
  online_status: 'offline' | 'online' | 'on_trip'
  rating: number | null
  total_trips: number | null
  created_at: string
  profile: { full_name: string | null; phone: string | null; profile_image: string | null } | null
  documents: { document_type: string; verification_status: 'pending' | 'verified' | 'rejected' }[] | null
}

const DRIVER_SELECT = `
  profile_id, vehicle_type, plate_number, approval_status, online_status, rating, total_trips, created_at,
  profile:profiles!drivers_profile_id_fkey ( full_name, phone, profile_image ),
  documents:driver_documents ( document_type, verification_status )
`

const localized = (value: string | null | undefined): Localized => {
  const v = value ?? '—'
  return { en: v, ar: v }
}

const VEHICLE_TYPE_MAP: Record<string, string> = {
  economy: 'economy',
  comfort: 'comfort',
  suv: 'premium',
  van: 'van',
  motorbike: 'bike',
}

const DOC_STATUS_MAP: Record<string, DocStatus> = {
  verified: 'valid',
  pending: 'pending',
  rejected: 'rejected',
}

/** Collapse approval + online status into the panel's single DriverStatus. */
function toDriverStatus(row: DriverRow): DriverStatus {
  if (row.approval_status === 'suspended' || row.approval_status === 'rejected') return 'suspended'
  if (row.approval_status === 'pending') return 'pending'
  return row.online_status === 'offline' ? 'offline' : 'active'
}

function toDocumentMap(docs: DriverRow['documents']): DocumentMap {
  const map: DocumentMap = {}
  for (const d of docs ?? []) {
    map[d.document_type] = DOC_STATUS_MAP[d.verification_status] ?? 'missing'
  }
  return map
}

function toDriver(row: DriverRow): Driver {
  return {
    id: row.profile_id,
    name: localized(row.profile?.full_name),
    phone: row.profile?.phone ?? '',
    vt: VEHICLE_TYPE_MAP[row.vehicle_type] ?? 'economy',
    vnum: row.plate_number ?? '',
    city: 'cairo',
    status: toDriverStatus(row),
    rating: Number(row.rating ?? 0),
    trips: row.total_trips ?? 0,
    joined: (row.created_at ?? '').slice(0, 10),
    verified: row.approval_status === 'approved',
    manual: false,
    docs: toDocumentMap(row.documents),
  }
}

/** Map a panel DriverStatus back to the backend approval action. */
function toApprovalStatus(status: DriverStatus): 'approved' | 'suspended' | 'pending' {
  if (status === 'suspended') return 'suspended'
  if (status === 'pending') return 'pending'
  return 'approved' // active | offline → approved
}

// ── Drivers ──────────────────────────────────────────────────────────────────
export class SupabaseDriverDataSource implements DriverDataSource {
  private get db() {
    return getSupabaseClient()
  }

  async fetchAll(): Promise<Driver[]> {
    const { data, error } = await this.db
      .from('drivers')
      .select(DRIVER_SELECT)
      .order('created_at', { ascending: false })
    if (error) throw error
    return ((data ?? []) as unknown as DriverRow[]).map(toDriver)
  }

  async updateStatus(id: string, status: DriverStatus): Promise<Driver> {
    const { error: rpcError } = await this.db.rpc('set_driver_approval', {
      p_driver_id: id,
      p_status: toApprovalStatus(status),
    })
    if (rpcError) throw rpcError

    const { data, error } = await this.db.from('drivers').select(DRIVER_SELECT).eq('profile_id', id).single()
    if (error) throw error
    return toDriver(data as unknown as DriverRow)
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from('drivers').delete().eq('profile_id', id)
    if (error) throw error
  }

  async insert(): Promise<Driver> {
    // Provisioning an auth user needs the service-role key (server side).
    // Drivers self-register from the Captain app; admins approve them under
    // Applications.
    throw new Error('Create drivers from the Captain app; approve them in Applications.')
  }
}

// ── Applications (pending drivers) ────────────────────────────────────────────
export class SupabaseApplicationDataSource implements ApplicationDataSource {
  private get db() {
    return getSupabaseClient()
  }

  async fetchAll(): Promise<DriverApplication[]> {
    const { data, error } = await this.db
      .from('drivers')
      .select(DRIVER_SELECT)
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false })
    if (error) throw error
    return ((data ?? []) as unknown as DriverRow[]).map((row) => ({
      id: row.profile_id,
      name: localized(row.profile?.full_name),
      phone: row.profile?.phone ?? '',
      vt: VEHICLE_TYPE_MAP[row.vehicle_type] ?? 'economy',
      vnum: row.plate_number ?? '',
      city: 'cairo',
      submitted: (row.created_at ?? '').slice(0, 10),
      status: 'review',
      docs: toDocumentMap(row.documents),
    }))
  }

  async approve(id: string): Promise<void> {
    const { error } = await this.db.rpc('set_driver_approval', { p_driver_id: id, p_status: 'approved' })
    if (error) throw error
  }

  async reject(id: string): Promise<void> {
    const { error } = await this.db.rpc('set_driver_approval', {
      p_driver_id: id,
      p_status: 'rejected',
      p_reason: 'Rejected from admin panel',
    })
    if (error) throw error
  }
}

// ── Passengers ────────────────────────────────────────────────────────────────
interface PassengerRow {
  id: string
  full_name: string | null
  phone: string | null
  created_at: string
  is_active: boolean
  trips: { count: number }[] | null
}

const PASSENGER_SELECT =
  'id, full_name, phone, created_at, is_active, trips:trips!trips_passenger_id_fkey(count)'

function toPassenger(row: PassengerRow): Passenger {
  return {
    id: row.id,
    name: localized(row.full_name),
    phone: row.phone ?? '',
    trips: row.trips?.[0]?.count ?? 0,
    joined: (row.created_at ?? '').slice(0, 10),
    status: row.is_active ? 'active' : 'suspended',
    city: 'cairo',
  }
}

export class SupabasePassengerDataSource implements PassengerDataSource {
  private get db() {
    return getSupabaseClient()
  }

  async fetchAll(): Promise<Passenger[]> {
    const { data, error } = await this.db
      .from('profiles')
      .select(PASSENGER_SELECT)
      .eq('role', 'passenger')
      .order('created_at', { ascending: false })
    if (error) throw error
    return ((data ?? []) as unknown as PassengerRow[]).map(toPassenger)
  }

  async updateStatus(id: string, status: PassengerStatus): Promise<Passenger> {
    const { data, error } = await this.db
      .from('profiles')
      .update({ is_active: status === 'active' })
      .eq('id', id)
      .select(PASSENGER_SELECT)
      .single()
    if (error) throw error
    return toPassenger(data as unknown as PassengerRow)
  }
}
