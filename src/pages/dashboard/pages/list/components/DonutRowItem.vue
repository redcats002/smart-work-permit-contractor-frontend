<template>
  <div class="bg-white flex gap-2 h-6 items-center overflow-hidden pr-4 rounded-sm shadow-[0px_0px_2px_0px_rgba(51,51,51,0.25)] w-full">
    <div
      :style="{ backgroundColor: color }"
      class="w-1.25 h-6 rounded-bl-sm rounded-tl-sm shrink-0" />
    <div class="flex-1 min-w-0 font-bold text-sm text-[#333] truncate">
      {{ label }}
    </div>
    <div class="flex-1 flex gap-2 items-end justify-end font-bold text-sm text-[#333] whitespace-nowrap">
      <span>{{ value }}</span>
      <span>{{ unit }}</span>
    </div>
    <div class="w-15 text-right text-sm text-[#828282] shrink-0">
      {{ percent }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value: string
  unit: string
  percent: string
  color: string
}

defineProps<Props>()
</script>
