import type {
  AdminUser,
  AuditEntry,
  Complaint,
  Coupon,
  Driver,
  DriverApplication,
  DriverStatus,
  Governorate,
  NotificationRecord,
  Passenger,
  PassengerStatus,
  PricingPlan,
  Review,
  Trip,
} from '@/core/domain/entities'

/**
 * Data source contracts. A data source is the lowest abstraction over a backend
 * (Supabase, REST, …). Repositories depend on these interfaces, allowing the
 * concrete backend to be swapped without touching the UI or the repositories.
 */

export interface DriverDataSource {
  fetchAll(): Promise<Driver[]>
  updateStatus(id: string, status: DriverStatus): Promise<Driver>
  delete(id: string): Promise<void>
  insert(driver: Driver): Promise<Driver>
}

export interface ApplicationDataSource {
  fetchAll(): Promise<DriverApplication[]>
  approve(id: string): Promise<void>
  reject(id: string): Promise<void>
}

export interface PassengerDataSource {
  fetchAll(): Promise<Passenger[]>
  updateStatus(id: string, status: PassengerStatus): Promise<Passenger>
}

export interface TripDataSource {
  fetchAll(): Promise<Trip[]>
}

export interface LocationDataSource {
  fetchGovernorates(): Promise<Governorate[]>
}

export interface ComplaintDataSource {
  fetchAll(): Promise<Complaint[]>
}

export interface ReviewDataSource {
  fetchAll(): Promise<Review[]>
  delete(id: string): Promise<void>
}

export interface CouponDataSource {
  fetchAll(): Promise<Coupon[]>
}

export interface AdminDataSource {
  fetchAll(): Promise<AdminUser[]>
}

export interface AuditDataSource {
  fetchAll(): Promise<AuditEntry[]>
  insert(entry: AuditEntry): Promise<void>
}

export interface PricingDataSource {
  fetchAll(): Promise<PricingPlan[]>
}

export interface NotificationDataSource {
  fetchHistory(): Promise<NotificationRecord[]>
}

export interface DashboardDataSource {
  fetchStats(): Promise<typeof import('../mock/seed')['SEED_DASHBOARD_STATS']>
}
