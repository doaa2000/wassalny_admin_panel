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
import * as seed from '../mock/seed'
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
} from './contracts'

/** Simulated network latency so loading states are exercised in mock mode. */
const LATENCY = 400
const delay = <T>(value: T, ms = LATENCY): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

/**
 * In-memory data sources. State is module-scoped so mutations persist for the
 * lifetime of the session — mimicking a real backend during development.
 */

let drivers: Driver[] = clone(seed.SEED_DRIVERS)
let passengers: Passenger[] = clone(seed.SEED_PASSENGERS)
let applications: DriverApplication[] = clone(seed.SEED_APPLICATIONS)
let reviews: Review[] = clone(seed.SEED_REVIEWS)
const audit: AuditEntry[] = clone(seed.SEED_AUDIT)

export class MockDriverDataSource implements DriverDataSource {
  fetchAll(): Promise<Driver[]> {
    return delay(clone(drivers))
  }
  async updateStatus(id: string, status: DriverStatus): Promise<Driver> {
    drivers = drivers.map((d) => (d.id === id ? { ...d, status } : d))
    const found = drivers.find((d) => d.id === id)!
    return delay(clone(found), 200)
  }
  async delete(id: string): Promise<void> {
    drivers = drivers.filter((d) => d.id !== id)
    await delay(null, 200)
  }
  async insert(driver: Driver): Promise<Driver> {
    drivers = [driver, ...drivers]
    return delay(clone(driver), 200)
  }
}

export class MockApplicationDataSource implements ApplicationDataSource {
  fetchAll(): Promise<DriverApplication[]> {
    return delay(clone(applications))
  }
  async approve(id: string): Promise<void> {
    const app = applications.find((a) => a.id === id)
    if (app) {
      drivers = [
        {
          id: 'DR-' + app.id.slice(3),
          name: app.name,
          phone: app.phone,
          vt: app.vt,
          vnum: app.vnum,
          city: app.city,
          status: 'active',
          rating: 0,
          trips: 0,
          joined: new Date().toISOString().slice(0, 10),
          manual: false,
          verified: true,
          docs: { ...app.docs },
        },
        ...drivers,
      ]
    }
    applications = applications.filter((a) => a.id !== id)
    await delay(null, 250)
  }
  async reject(id: string): Promise<void> {
    applications = applications.filter((a) => a.id !== id)
    await delay(null, 250)
  }
}

export class MockPassengerDataSource implements PassengerDataSource {
  fetchAll(): Promise<Passenger[]> {
    return delay(clone(passengers))
  }
  async updateStatus(id: string, status: PassengerStatus): Promise<Passenger> {
    passengers = passengers.map((p) => (p.id === id ? { ...p, status } : p))
    return delay(clone(passengers.find((p) => p.id === id)!), 200)
  }
}

export class MockTripDataSource implements TripDataSource {
  fetchAll(): Promise<Trip[]> {
    return delay(clone(seed.SEED_TRIPS))
  }
}

export class MockLocationDataSource implements LocationDataSource {
  fetchGovernorates(): Promise<Governorate[]> {
    return delay(clone(seed.SEED_GOVERNORATES))
  }
}

export class MockComplaintDataSource implements ComplaintDataSource {
  fetchAll(): Promise<Complaint[]> {
    return delay(clone(seed.SEED_COMPLAINTS))
  }
}

export class MockReviewDataSource implements ReviewDataSource {
  fetchAll(): Promise<Review[]> {
    return delay(clone(reviews))
  }
  async delete(id: string): Promise<void> {
    reviews = reviews.filter((r) => r.id !== id)
    await delay(null, 200)
  }
}

export class MockCouponDataSource implements CouponDataSource {
  fetchAll(): Promise<Coupon[]> {
    return delay(clone(seed.SEED_COUPONS))
  }
}

export class MockAdminDataSource implements AdminDataSource {
  fetchAll(): Promise<AdminUser[]> {
    return delay(clone(seed.SEED_ADMINS))
  }
}

export class MockAuditDataSource implements AuditDataSource {
  fetchAll(): Promise<AuditEntry[]> {
    return delay(clone(audit))
  }
  async insert(entry: AuditEntry): Promise<void> {
    audit.unshift(entry)
    await delay(null, 100)
  }
}

export class MockPricingDataSource implements PricingDataSource {
  fetchAll(): Promise<PricingPlan[]> {
    return delay(clone(seed.SEED_PRICING))
  }
}

export class MockNotificationDataSource implements NotificationDataSource {
  fetchHistory(): Promise<NotificationRecord[]> {
    return delay(clone(seed.SEED_NOTIFICATIONS))
  }
}

export class MockDashboardDataSource implements DashboardDataSource {
  fetchStats() {
    return delay(clone(seed.SEED_DASHBOARD_STATS))
  }
}
