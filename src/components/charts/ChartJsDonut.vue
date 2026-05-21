<template>
  <canvas
    ref="canvasRef"
    :aria-label="ariaLabel"
    class="absolute inset-0 w-full h-full z-10"
    role="img" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Chart } from 'chart.js/auto'

export interface DonutItem {
  label: string
  value: number
  color?: string
}

interface Props {
  items: DonutItem[]
  ariaLabel?: string
  cutout?: string
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Donut chart',
  cutout: '68%'
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'doughnut'> | null = null

const defaultPalette = [
  '#7f0d0d',
  '#b81818',
  '#ff2b2b',
  '#ff5a5a',
  '#ff8c8c',
  '#ffc1c1',
  '#ffdede'
]

const buildChart = (): void => {
  if (!canvasRef.value) return
  if (chart) chart.destroy()

  const data = props.items.map((item: DonutItem): number => {
    return item.value
  })
  const labels = props.items.map((item: DonutItem): string => {
    return item.label
  })
  const colors = props.items.map((item: DonutItem, index: number): string => {
    return item.color ?? defaultPalette[index % defaultPalette.length]
  })

  chart = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: props.cutout,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          bodyFont: { family: 'LINE_Seed_Sans_TH' },
          titleFont: { family: 'LINE_Seed_Sans_TH' }
        }
      }
    }
  })
}

const destroyChart = (): void => {
  if (chart) chart.destroy()
}

const itemsSource = (): DonutItem[] => props.items
const handleItemsChange = (): void => {
  buildChart()
}

onMounted(buildChart)
onBeforeUnmount(destroyChart)

watch(itemsSource, handleItemsChange, { deep: true })
</script>
