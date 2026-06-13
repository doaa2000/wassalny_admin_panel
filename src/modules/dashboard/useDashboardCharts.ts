import { computed } from 'vue'
import type { ChartConfiguration } from 'chart.js'
import { useI18n } from '@/core/composables/useI18n'
import { useThemeTokens } from '@/core/composables/useThemeTokens'
import { CITIES } from '@/core/constants/localized'

/**
 * Builds the dashboard chart configurations, recomputed whenever the theme or
 * locale changes (so axes/legends re-colour and re-localise).
 */
export function useDashboardCharts() {
  const { t, L, isRtl } = useI18n()
  const { tokens } = useThemeTokens()

  const rebuildKey = computed(() => `${tokens.value.tick}-${isRtl.value}`)

  const baseScales = () => ({
    x: { grid: { display: false }, ticks: { color: tokens.value.tick, font: { family: 'Tajawal', size: 12 } } },
    y: {
      grid: { color: tokens.value.grid },
      ticks: { color: tokens.value.tick, font: { family: 'Tajawal', size: 12 } },
      beginAtZero: true,
    },
  })

  const trips = computed<ChartConfiguration>(() => ({
    type: 'line',
    data: {
      labels: Array.from({ length: 14 }, (_, i) => `${i + 1}`),
      datasets: [
        {
          label: t('completed'),
          data: [210, 245, 232, 268, 290, 275, 310, 298, 330, 352, 341, 368, 389, 402],
          borderColor: tokens.value.primary,
          backgroundColor: 'rgba(249,115,22,.12)',
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: t('cancelled'),
          data: [28, 32, 24, 30, 35, 29, 38, 33, 40, 36, 42, 38, 45, 41],
          borderColor: '#94A3B8',
          fill: false,
          tension: 0.4,
          borderWidth: 2,
          borderDash: [5, 4],
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: baseScales(),
      interaction: { mode: 'index', intersect: false },
    },
  }))

  const city = computed<ChartConfiguration>(() => ({
    type: 'doughnut',
    data: {
      labels: [L(CITIES.cairo), L(CITIES.giza), L(CITIES.alex), L(CITIES.mansoura), L(CITIES.aswan)],
      datasets: [
        {
          data: [42, 23, 18, 10, 7],
          backgroundColor: ['#F97316', '#6366F1', '#10B981', '#3B82F6', '#F59E0B'],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: isRtl.value ? 'left' : 'right',
          labels: {
            color: tokens.value.tick,
            font: { family: 'Tajawal', size: 12.5 },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 14,
            boxWidth: 8,
          },
        },
      },
    },
  }))

  const revenue = computed<ChartConfiguration>(() => ({
    type: 'line',
    data: {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
      datasets: [
        {
          label: 'Revenue',
          data: [620, 710, 680, 820, 910, 980],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16,185,129,.18)',
          fill: true,
          tension: 0.45,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: baseScales(),
    },
  }))

  const activity = computed<ChartConfiguration>(() => ({
    type: 'bar',
    data: {
      labels: ['6', '9', '12', '15', '18', '21', '24'],
      datasets: [
        {
          data: [420, 980, 760, 840, 1240, 1580, 690],
          backgroundColor: tokens.value.primary,
          borderRadius: 8,
          barThickness: 22,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: baseScales(),
    },
  }))

  return { rebuildKey, trips, city, revenue, activity }
}
