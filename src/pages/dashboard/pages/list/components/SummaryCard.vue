<template>
  <div
    :class="cardClass"
    :style="cardStyle"
    class="w-full bg-white rounded-xl p-5 flex items-center justify-between shadow-sm">
    <div>
      <div class="text-sm text-surface-600">
        {{ title }}
      </div>
      <div class="mt-2 text-[24px] font-normal text-surface-900">
        {{ amount }} <span class="text-sm font-normal">{{ unit }}</span>
      </div>
    </div>
    <div
      :class="iconClass"
      class="w-12 h-12 rounded-full flex items-center justify-center">
      <slot name="icon">
        {{ iconText }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  amount: string
  unit?: string
  iconText?: string
  cardClass?: string
  iconClass?: string
  cardStyle?: Record<string, string>
}

withDefaults(defineProps<Props>(), {
  unit: 'บาท',
  iconText: '',
  cardClass: 'border border-(--p-gray-5)',
  iconClass: 'bg-(--p-gray-5) text-surface-700',
  cardStyle: undefined
})
</script>
