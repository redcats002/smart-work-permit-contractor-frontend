<template>
  <div class="flex items-center gap-1 text-sm w-[268px]">
    <span
      :class="bold ? 'w-[162px]' : 'w-[162px]'"
      class="font-bold text-[#333]">
      {{ label }}
    </span>
    <span class="font-normal text-[#333]">:</span>
    <span
      :style="bold ? 'font-weight: 800;' : ''"
      class="font-normal text-[#333]">
      {{ formatNumber(value) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { formatter } from '@/utils/Formatter'

interface IProps {
  label: string
  value: number
  bold?: boolean
}

defineProps<IProps>()

function formatNumber (value: number): string {
  return formatter.numberFormat(value)
}
</script>
