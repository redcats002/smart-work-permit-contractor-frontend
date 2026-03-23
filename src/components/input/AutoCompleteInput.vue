<template>
  <AutoComplete
    v-bind="$attrs"
    :class="$attrs.multiple ? 'min-h-9 shadow-none!' : 'h-9 shadow-none!'"
    :dropdown="dropdown"
    dropdown-class="bg-white"
    fluid>
    <template #clearicon="{ clearCallback }">
      <div class="flex justify-center items-center border border-l-0 border-r-0 border-surface-300">
        <Icon
          class="size-5 text-[rgb(164,176,193)] cursor-pointer hover:text-black transition-all duration-200"
          icon="mdi:close"
          @click="clearCallback($event)" />
      </div>
    </template>
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
import AutoComplete from '@/volt/AutoComplete.vue'
import { Icon } from '@iconify/vue'
import type { AutoCompleteProps } from 'primevue'

interface IProps extends /* @vue-ignore */ AutoCompleteProps {
  dropdown?: boolean
}

withDefaults(defineProps<IProps>(), {
  dropdown: true
})
</script>

<style scoped></style>
