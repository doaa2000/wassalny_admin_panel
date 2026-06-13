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
  Passenger,
  PassengerStatus,
  PricingPlan,
  Review,
  Trip,
} from '@/core/domain/entities'
import type {
  IAdminRepository,
  IApplicationRepository,
  IAuditRepository,
  IComplaintRepository,
  ICouponRepository,
  IDashboardRepository,
  IDriverRepository,
  ILocationRepository,
  INotificationRepository,
  IPassengerRepository,
  IPricingRepository,
  IReviewRepository,
  ITripRepository,
} from '@/core/domain/repositories'
import { statusPalette } from '@/core/constants/palette'
import type {
  AdminDataSource,
  ApplicationDataSource,
  AuditDataSource,
  ComplaintDataSource,
  CouponDataSource,
  DashboardDataSource,
  DriverDataSource,
  LocationDataSource,
  NotificationDataSource,
  PassengerDataSource,
  PricingDataSource,
  ReviewDataSource,
  TripDataSource,
} from '../datasources/contracts'

/**
 * Repositories translate between the domain layer and a data source. They are
 * the seam the UI depends on; they can add caching, mapping or orchestration
 * without leaking backend details. Each accepts its data source via the
 * constructor (dependency inversion).
 */

export class DriverRepository implements IDriverRepository {
  constructor(private readonly ds: DriverDataSource) {}
  list(): Promise<Driver[]> {
    return this.ds.fetchAll()
  }
  setStatus(id: string, status: DriverStatus): Promise<Driver> {
    return this.ds.updateStatus(id, status)
  }
  remove(id: string): Promise<void> {
    return this.ds.delete(id)
  }
  create(driver: Driver): Promise<Driver> {
    return this.ds.insert(driver)
  }
}

export class ApplicationRepository implements IApplicationRepository {
  constructor(private readonly ds: ApplicationDataSource) {}
  list(): Promise<DriverApplication[]> {
    return this.ds.fetchAll()
  }
  approve(id: string): Promise<void> {
    return this.ds.approve(id)
  }
  reject(id: string): Promise<void> {
    return this.ds.reject(id)
  }
}

export class PassengerRepository implements IPassengerRepository {
  constructor(private readonly ds: PassengerDataSource) {}
  list(): Promise<Passenger[]> {
    return this.ds.fetchAll()
  }
  setStatus(id: string, status: PassengerStatus): Promise<Passenger> {
    return this.ds.updateStatus(id, status)
  }
}

export class TripRepository implements ITripRepository {
  constructor(private readonly ds: TripDataSource) {}
  list(): Promise<Trip[]> {
    return this.ds.fetchAll()
  }
}

export class LocationRepository implements ILocationRepository {
  constructor(private readonly ds: LocationDataSource) {}
  listGovernorates(): Promise<Governorate[]> {
    return this.ds.fetchGovernorates()
  }
}

export class ComplaintRepository implements IComplaintRepository {
  constructor(private readonly ds: ComplaintDataSource) {}
  list(): Promise<Complaint[]> {
    return this.ds.fetchAll()
  }
}

export class ReviewRepository implements IReviewRepository {
  constructor(private readonly ds: ReviewDataSource) {}
  list(): Promise<Review[]> {
    return this.ds.fetchAll()
  }
  remove(id: string): Promise<void> {
    return this.ds.delete(id)
  }
}

export class CouponRepository implements ICouponRepository {
  constructor(private readonly ds: CouponDataSource) {}
  list(): Promise<Coupon[]> {
    return this.ds.fetchAll()
  }
}

export class AdminRepository implements IAdminRepository {
  constructor(private readonly ds: AdminDataSource) {}
  list(): Promise<AdminUser[]> {
    return this.ds.fetchAll()
  }
}

export class AuditRepository implements IAuditRepository {
  constructor(private readonly ds: AuditDataSource) {}
  list(): Promise<AuditEntry[]> {
    return this.ds.fetchAll()
  }
  record(entry: AuditEntry): Promise<void> {
    return this.ds.insert(entry)
  }
}

export class PricingRepository implements IPricingRepository {
  constructor(private readonly ds: PricingDataSource) {}
  list(): Promise<PricingPlan[]> {
    return this.ds.fetchAll()
  }
}

export class NotificationRepository implements INotificationRepository {
  constructor(private readonly ds: NotificationDataSource) {}
  history(): Promise<NotificationRecord[]> {
    return this.ds.fetchHistory()
  }
}

export class DashboardRepository implements IDashboardRepository {
  constructor(private readonly ds: DashboardDataSource) {}
  async stats(): Promise<DashboardStat[]> {
    const raw = await this.ds.fetchStats()
    // Domain mapping: ensure each stat carries a resolved palette key.
    return raw.map((s) => ({ ...s, palette: s.palette ?? statusPalette(s.key).c }))
  }
}
