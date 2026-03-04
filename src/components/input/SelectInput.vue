<template>
  <Select
    v-bind="$attrs"
    class="h-9 shadow-none! rounded-sm!"
    fluid>
    <template #dropdownicon>
      <Icon
        class="size-5 text-[#A4B0C1]"
        icon="mdi:chevron-down" />
    </template>
    <template
      v-for="(_, slotName) in $slots"
      :key="slotName"
      #[slotName]="slotProps">
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}" />
    </template>
  </Select>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<style scoped>

</style>
