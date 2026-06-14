import type { Localized } from '@/core/constants/localized'

/** Lifecycle status shared by people/records. */
export type DriverStatus = 'active' | 'offline' | 'suspended' | 'pending'
export type PassengerStatus = 'active' | 'suspended' | 'inactive'
export type TripStatus = 'pending' | 'accepted' | 'started' | 'completed' | 'cancelled'
export type ApplicationStatus = 'review' | 'approved' | 'rejected'
export type ComplaintStatus = 'open' | 'inprogress' | 'resolved' | 'closed'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type AdminRole = 'super' | 'ops' | 'support' | 'finance'
export type CouponStatus = 'active' | 'closed'
export type DocStatus = 'valid' | 'pending' | 'missing' | 'rejected'

/** Verification documents keyed by document type. */
export type DocumentMap = Record<string, DocStatus>

export interface Driver {
  id: string
  name: Localized
  phone: string
  /** Vehicle type key (see VEHICLE_TYPES). */
  vt: string
  /** Vehicle plate number. */
  vnum: string
  /** City key (see CITIES). */
  city: string
  status: DriverStatus
  rating: number
  trips: number
  joined: string
  verified: boolean
  manual: boolean
  docs: DocumentMap
}

export interface Passenger {
  id: string
  name: Localized
  phone: string
  trips: number
  joined: string
  status: PassengerStatus
  city: string
}

export interface Trip {
  id: string
  /** Driver index into the drivers collection (mock seed convention). */
  driver: number
  /** Passenger index into the passengers collection (mock seed convention). */
  pass: number
  /** Resolved driver name (live backend). Falls back to the seed index when absent. */
  driverName?: Localized
  /** Resolved passenger name (live backend). Falls back to the seed index when absent. */
  passengerName?: Localized
  from: Localized
  to: Localized
  price: number
  date: string
  status: TripStatus
  city: string
}

export interface DriverApplication {
  id: string
  name: Localized
  phone: string
  vt: string
  vnum: string
  city: string
  submitted: string
  status: ApplicationStatus
  docs: DocumentMap
}

export interface Complaint {
  id: string
  user: Localized
  type: Localized
  status: ComplaintStatus
  priority: Priority
}

export interface Governorate {
  id: string
  name: Localized
  cities: number
  drivers: number
  status: 'active' | 'inactive'
}

export interface Review {
  id: string
  by: Localized
  target: Localized
  role: 'driver' | 'passenger'
  rating: number
  text: Localized
  date: string
  flagged: boolean
}

export interface Coupon {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  used: number
  limit: number
  exp: string
  status: CouponStatus
}

export interface AdminUser {
  id: string
  name: Localized
  email: string
  role: AdminRole
  status: 'active' | 'inactive'
  last: string
}

export interface AuditEntry {
  admin: Localized
  action: Localized
  target: string
  date: string
  time: string
}

export interface NotificationRecord {
  title: Localized
  target: string
  sent: string
  reach: number
  opened: number
}

export interface PricingPlan {
  vt: string
  base: number
  km: number
  min: number
  service: number
  minp: number
}

/** Aggregated dashboard metrics. */
export interface DashboardStat {
  key: string
  value: string
  delta: string
  up: boolean
  icon: string
  palette: string
}

export interface DashboardSummary {
  stats: DashboardStat[]
}
