<template>
  <AutoComplete
    v-bind="$attrs"
    class="h-9 shadow-none!"
    dropdown-class="bg-white"
    dropdown
    fluid>
    <template #chip="{ value, removeCallback }">
      <span class="flex items-center gap-1 rounded-md bg-[#E7F4FF] px-2 py-1 text-sm text-[#027CE9] h-6">
        <span>
          {{ value?.name || value }}
        </span>
        <Icon
          :stroke-width="2"
          class="size-5 text-[#62748E] cursor-pointer hover:text-black transition-all duration-200"
          icon="mdi:close"
          @click="removeCallback($event)" />
      </span>
    </template>
    <template #dropdownicon>
      <Icon
        class="size-5 text-[#A4B0C1]"
        icon="mdi:chevron-down" />
    </template>
    <template #empty>
      ไม่พบข้อมูล
    </template>
  </AutoComplete>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<style scoped></style>
