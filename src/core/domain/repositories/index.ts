import type {
  AdminUser,
  AuditEntry,
  Complaint,
  Coupon,
  DashboardStat,
  Driver,
  DriverApplication,
  DriverStatus,
  Governorate,
  NotificationRecord,
  PassengerStatus,
  Passenger,
  PricingPlan,
  Review,
  Trip,
} from '../entities'

/**
 * Domain repository contracts. The presentation layer depends ONLY on these
 * interfaces — never on a concrete data source (Supabase / REST / …).
 */

export interface IDriverRepository {
  list(): Promise<Driver[]>
  setStatus(id: string, status: DriverStatus): Promise<Driver>
  remove(id: string): Promise<void>
  create(driver: Driver): Promise<Driver>
}

export interface IApplicationRepository {
  list(): Promise<DriverApplication[]>
  approve(id: string): Promise<void>
  reject(id: string): Promise<void>
}

export interface IPassengerRepository {
  list(): Promise<Passenger[]>
  setStatus(id: string, status: PassengerStatus): Promise<Passenger>
}

export interface ITripRepository {
  list(): Promise<Trip[]>
}

export interface ILocationRepository {
  listGovernorates(): Promise<Governorate[]>
}

export interface IComplaintRepository {
  list(): Promise<Complaint[]>
}

export interface IReviewRepository {
  list(): Promise<Review[]>
  remove(id: string): Promise<void>
}

export interface ICouponRepository {
  list(): Promise<Coupon[]>
}

export interface IAdminRepository {
  list(): Promise<AdminUser[]>
}

export interface IAuditRepository {
  list(): Promise<AuditEntry[]>
  record(entry: AuditEntry): Promise<void>
}

export interface IPricingRepository {
  list(): Promise<PricingPlan[]>
}

export interface INotificationRepository {
  history(): Promise<NotificationRecord[]>
}

export interface IDashboardRepository {
  stats(): Promise<DashboardStat[]>
}
