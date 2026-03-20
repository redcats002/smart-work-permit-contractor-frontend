<template>
  <div
    :class="cardClass"
    :style="cardStyle"
    class="bg-white border border-(--p-gray-5) rounded-xl p-5 text-center shadow-sm">
    <div
      :class="valueClass"
      class="text-3xl font-semibold">
      {{ value }}
    </div>
    <div class="mt-2 text-sm text-surface-600">
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string
  label: string
  valueClass: string
  cardClass?: string
  cardStyle?: Record<string, string>
}

withDefaults(defineProps<Props>(), {
  cardClass: '',
  cardStyle: undefined
})
</script>
