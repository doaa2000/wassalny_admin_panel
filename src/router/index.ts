import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/shared/layouts/AdminLayout.vue'
import type { TranslationKey } from '@/core/constants/i18n'

declare module 'vue-router' {
  interface RouteMeta {
    /** Translation key for the screen title (used in breadcrumb + tab). */
    titleKey: TranslationKey
    /** Translation key for the screen subtitle. */
    subKey?: TranslationKey
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AdminLayout,
    children: [
      { path: '', redirect: { name: 'dashboard' } },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/modules/dashboard/DashboardPage.vue'),
        meta: { titleKey: 'dashboard' },
      },
      {
        path: 'drivers',
        name: 'drivers',
        component: () => import('@/modules/drivers/DriversPage.vue'),
        meta: { titleKey: 'drivers' },
      },
      {
        path: 'applications',
        name: 'applications',
        component: () => import('@/modules/applications/ApplicationsPage.vue'),
        meta: { titleKey: 'applications' },
      },
      {
        path: 'onboarding-flow',
        name: 'flow',
        component: () => import('@/modules/flow/FlowPage.vue'),
        meta: { titleKey: 'flow' },
      },
      {
        path: 'passengers',
        name: 'passengers',
        component: () => import('@/modules/passengers/PassengersPage.vue'),
        meta: { titleKey: 'passengers' },
      },
      {
        path: 'trips',
        name: 'trips',
        component: () => import('@/modules/trips/TripsPage.vue'),
        meta: { titleKey: 'trips' },
      },
      {
        path: 'live-map',
        name: 'livemap',
        component: () => import('@/modules/livemap/LiveMapPage.vue'),
        meta: { titleKey: 'livemap' },
      },
      {
        path: 'earnings',
        name: 'earnings',
        component: () => import('@/modules/earnings/EarningsPage.vue'),
        meta: { titleKey: 'earnings' },
      },
      {
        path: 'pricing',
        name: 'pricing',
        component: () => import('@/modules/pricing/PricingPage.vue'),
        meta: { titleKey: 'pricing' },
      },
      {
        path: 'locations',
        name: 'locations',
        component: () => import('@/modules/locations/LocationsPage.vue'),
        meta: { titleKey: 'locations' },
      },
      {
        path: 'coupons',
        name: 'coupons',
        component: () => import('@/modules/coupons/CouponsPage.vue'),
        meta: { titleKey: 'coupons' },
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: () => import('@/modules/notifications/NotificationsPage.vue'),
        meta: { titleKey: 'notifications' },
      },
      {
        path: 'complaints',
        name: 'complaints',
        component: () => import('@/modules/complaints/ComplaintsPage.vue'),
        meta: { titleKey: 'complaints' },
      },
      {
        path: 'ratings',
        name: 'ratings',
        component: () => import('@/modules/ratings/RatingsPage.vue'),
        meta: { titleKey: 'ratings' },
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/modules/reports/ReportsPage.vue'),
        meta: { titleKey: 'reports' },
      },
      {
        path: 'content',
        name: 'content',
        component: () => import('@/modules/content/ContentPage.vue'),
        meta: { titleKey: 'content' },
      },
      {
        path: 'admins',
        name: 'admins',
        component: () => import('@/modules/admins/AdminsPage.vue'),
        meta: { titleKey: 'admins' },
      },
      {
        path: 'audit',
        name: 'audit',
        component: () => import('@/modules/audit/AuditPage.vue'),
        meta: { titleKey: 'audit' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/modules/settings/SettingsPage.vue'),
        meta: { titleKey: 'settings' },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: { name: 'dashboard' } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
