import type {
  DocStatus,
  DocumentMap,
  Driver,
  DriverApplication,
  DriverStatus,
  NotificationRecord,
  Passenger,
  PassengerStatus,
  Review,
  Trip,
  TripStatus,
} from '@/core/domain/entities'
import type { Localized } from '@/core/constants/localized'
import { getSupabaseClient } from '@/core/config/supabase'
import type {
  ApplicationDataSource,
  DashboardDataSource,
  DriverDataSource,
  NotificationDataSource,
  PassengerDataSource,
  ReviewDataSource,
  TripDataSource,
} from './contracts'

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

// ── Trips ─────────────────────────────────────────────────────────────────────
const TRIP_STATUS_MAP: Record<string, TripStatus> = {
  requested: 'pending',
  accepted: 'accepted',
  arrived: 'accepted',
  in_progress: 'started',
  completed: 'completed',
  cancelled: 'cancelled',
  rejected: 'cancelled',
  expired: 'cancelled',
}

interface TripRow {
  id: string
  pickup_address: string | null
  destination_address: string | null
  trip_price: number | null
  status: string
  created_at: string
  passenger: { full_name: string | null } | null
  driver: { profile: { full_name: string | null } | null } | null
}

const TRIP_SELECT = `
  id, pickup_address, destination_address, trip_price, status, created_at,
  passenger:profiles!trips_passenger_id_fkey ( full_name ),
  driver:drivers!trips_driver_id_fkey ( profile:profiles!drivers_profile_id_fkey ( full_name ) )
`

export class SupabaseTripDataSource implements TripDataSource {
  private get db() {
    return getSupabaseClient()
  }

  async fetchAll(): Promise<Trip[]> {
    const { data, error } = await this.db
      .from('trips')
      .select(TRIP_SELECT)
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) throw error
    return ((data ?? []) as unknown as TripRow[]).map((row) => ({
      id: row.id,
      driver: 0,
      pass: 0,
      driverName: row.driver == null
        ? localized('Unassigned')
        : localized(row.driver.profile?.full_name ?? 'Driver'),
      passengerName: localized(row.passenger?.full_name ?? 'Passenger'),
      from: localized(row.pickup_address),
      to: localized(row.destination_address),
      price: Number(row.trip_price ?? 0),
      date: (row.created_at ?? '').replace('T', ' ').slice(0, 16),
      status: TRIP_STATUS_MAP[row.status] ?? 'pending',
      city: 'cairo',
    }))
  }
}

// ── Ratings / reviews ─────────────────────────────────────────────────────────
interface ReviewRow {
  id: string
  rating: number | null
  review: string | null
  created_at: string
  passenger: { full_name: string | null } | null
  driver: { profile: { full_name: string | null } | null } | null
}

const REVIEW_SELECT = `
  id, rating, review, created_at,
  passenger:profiles!ratings_passenger_id_fkey ( full_name ),
  driver:drivers!ratings_driver_id_fkey ( profile:profiles!drivers_profile_id_fkey ( full_name ) )
`

export class SupabaseReviewDataSource implements ReviewDataSource {
  private get db() {
    return getSupabaseClient()
  }

  async fetchAll(): Promise<Review[]> {
    const { data, error } = await this.db
      .from('ratings')
      .select(REVIEW_SELECT)
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) throw error
    return ((data ?? []) as unknown as ReviewRow[]).map((row) => ({
      id: row.id,
      by: localized(row.passenger?.full_name),
      target: localized(row.driver?.profile?.full_name),
      role: 'driver' as const,
      rating: Number(row.rating ?? 0),
      text: localized(row.review ?? ''),
      date: (row.created_at ?? '').slice(0, 10),
      flagged: false,
    }))
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from('ratings').delete().eq('id', id)
    if (error) throw error
  }
}

// ── Notifications history ─────────────────────────────────────────────────────
interface NotificationHistoryRow {
  title: string
  target: string
  sent: string
  reach: number
  opened: number
}

export class SupabaseNotificationDataSource implements NotificationDataSource {
  private get db() {
    return getSupabaseClient()
  }

  async fetchHistory(): Promise<NotificationRecord[]> {
    const { data, error } = await this.db.rpc('admin_notification_history')
    if (error) throw error
    return ((data ?? []) as NotificationHistoryRow[]).map((row) => ({
      title: localized(row.title),
      target: row.target,
      sent: row.sent,
      reach: row.reach ?? 0,
      opened: row.opened ?? 0,
    }))
  }
}

// ── Dashboard KPIs ────────────────────────────────────────────────────────────
interface DashboardStatsRow {
  total_drivers: number
  active_drivers: number
  total_passengers: number
  trips_today: number
  trips_month: number
  total_revenue: number
  today_revenue: number
  cancelled: number
}

const num = (v: number): string => Math.round(v ?? 0).toLocaleString('en-US')
const egpCompact = (v: number): string => {
  const n = v ?? 0
  if (n >= 1_000_000) return `EGP ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `EGP ${Math.round(n / 1_000)}K`
  return `EGP ${Math.round(n)}`
}

export class SupabaseDashboardDataSource implements DashboardDataSource {
  private get db() {
    return getSupabaseClient()
  }

  async fetchStats() {
    const { data, error } = await this.db.rpc('admin_dashboard_stats')
    if (error) throw error
    const s = (data ?? {}) as DashboardStatsRow
    return [
      { key: 'totalDrivers', value: num(s.total_drivers), delta: '', up: true, icon: 'drivers', palette: 'orange' },
      { key: 'activeDrivers', value: num(s.active_drivers), delta: '', up: true, icon: 'car', palette: 'green' },
      { key: 'totalPassengers', value: num(s.total_passengers), delta: '', up: true, icon: 'passengers', palette: 'indigo' },
      { key: 'tripsToday', value: num(s.trips_today), delta: '', up: true, icon: 'trips', palette: 'blue' },
      { key: 'tripsMonth', value: num(s.trips_month), delta: '', up: true, icon: 'trending', palette: 'violet' },
      { key: 'totalRevenue', value: egpCompact(s.total_revenue), delta: '', up: true, icon: 'wallet', palette: 'teal' },
      { key: 'todayRevenue', value: egpCompact(s.today_revenue), delta: '', up: true, icon: 'earnings', palette: 'green' },
      { key: 'cancelled', value: num(s.cancelled), delta: '', up: false, icon: 'xCircle', palette: 'red' },
    ]
  }
}
