<template>
  <div
    :class="cardClass"
    :style="cardStyle"
    class="w-full bg-white rounded-xl p-5 flex items-center justify-between shadow-sm
    transition-all border border-(--p-gray-5) hover:border-(--p-red)! hover:scale-[1.02]">
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
        <Icon
          :icon="icon"
          class="h-6 w-6" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  title: string
  amount: string
  unit?: string
  iconText?: string
  cardClass?: string
  icon?: string
  iconClass?: string
  cardStyle?: Record<string, string>
}

withDefaults(defineProps<Props>(), {
  unit: 'บาท',
  iconText: '',
  icon: '',
  cardClass: 'border border-(--p-gray-5)',
  iconClass: 'bg-(--p-gray-5) text-surface-700',
  cardStyle: undefined
})
</script>
