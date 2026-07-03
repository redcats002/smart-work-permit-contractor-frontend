<template>
  <div class="flex gap-[2px] items-center text-[14px] text-[#333] w-[268px]">
    <span
      class="font-bold w-[162px]">
      {{ label }}
    </span>
    <div class="flex gap-[2px] items-center whitespace-nowrap">
      <span class="font-normal">:</span>
      <span
        :style="bold ? 'font-weight: 800;' : ''"
        class="font-normal">
        {{ formatNumber(value) }}
      </span>
    </div>
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
