import { env } from '@/core/config/env'
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
import * as mock from '@/core/data/datasources/mock'
import {
  SupabaseApplicationDataSource,
  SupabaseDriverDataSource,
  SupabasePassengerDataSource,
} from '@/core/data/datasources/supabase'
import {
  AdminRepository,
  ApplicationRepository,
  AuditRepository,
  ComplaintRepository,
  CouponRepository,
  DashboardRepository,
  DriverRepository,
  LocationRepository,
  NotificationRepository,
  PassengerRepository,
  PricingRepository,
  ReviewRepository,
  TripRepository,
} from '@/core/data/repositories'

/**
 * Composition root / dependency-injection container.
 *
 * This is where concrete data sources are chosen and injected into
 * repositories. Flipping `VITE_USE_MOCK` swaps the entire backend. Because the
 * UI only ever resolves repositories through `repositories`, nothing downstream
 * needs to change.
 */
export interface RepositoryRegistry {
  drivers: IDriverRepository
  applications: IApplicationRepository
  passengers: IPassengerRepository
  trips: ITripRepository
  locations: ILocationRepository
  complaints: IComplaintRepository
  reviews: IReviewRepository
  coupons: ICouponRepository
  admins: IAdminRepository
  audit: IAuditRepository
  pricing: IPricingRepository
  notifications: INotificationRepository
  dashboard: IDashboardRepository
}

function buildRegistry(): RepositoryRegistry {
  const useMock = env.useMock

  // Drivers / applications / passengers have real Supabase implementations.
  const driverDs = useMock ? new mock.MockDriverDataSource() : new SupabaseDriverDataSource()
  const applicationDs = useMock
    ? new mock.MockApplicationDataSource()
    : new SupabaseApplicationDataSource()
  const passengerDs = useMock
    ? new mock.MockPassengerDataSource()
    : new SupabasePassengerDataSource()

  // Remaining domains use the mock data source until their Supabase tables are
  // provisioned; their repositories are backend-agnostic regardless.
  return {
    drivers: new DriverRepository(driverDs),
    applications: new ApplicationRepository(applicationDs),
    passengers: new PassengerRepository(passengerDs),
    trips: new TripRepository(new mock.MockTripDataSource()),
    locations: new LocationRepository(new mock.MockLocationDataSource()),
    complaints: new ComplaintRepository(new mock.MockComplaintDataSource()),
    reviews: new ReviewRepository(new mock.MockReviewDataSource()),
    coupons: new CouponRepository(new mock.MockCouponDataSource()),
    admins: new AdminRepository(new mock.MockAdminDataSource()),
    audit: new AuditRepository(new mock.MockAuditDataSource()),
    pricing: new PricingRepository(new mock.MockPricingDataSource()),
    notifications: new NotificationRepository(new mock.MockNotificationDataSource()),
    dashboard: new DashboardRepository(new mock.MockDashboardDataSource()),
  }
}

let registry: RepositoryRegistry | null = null

/** Resolve the shared repository registry (lazily constructed). */
export function repositories(): RepositoryRegistry {
  if (!registry) registry = buildRegistry()
  return registry
}
