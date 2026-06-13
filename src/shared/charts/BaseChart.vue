<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  Chart,
  type ChartConfiguration,
  LineController,
  BarController,
  DoughnutController,
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(
  LineController,
  BarController,
  DoughnutController,
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
)

const props = defineProps<{
  config: ChartConfiguration
  /** Changing this key forces a full chart rebuild (e.g. theme/locale). */
  rebuildKey?: string
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
let instance: Chart | null = null

function build() {
  if (!canvas.value) return
  instance?.destroy()
  instance = new Chart(canvas.value, props.config)
}

onMounted(build)
watch(() => props.rebuildKey, build)
onBeforeUnmount(() => instance?.destroy())
</script>

<template>
  <div class="relative h-full w-full">
    <canvas ref="canvas" />
  </div>
</template>
