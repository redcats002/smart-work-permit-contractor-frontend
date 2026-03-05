<template>
  <div class="max-w-full overflow-x-auto">
    <div class="inline-flex min-w-max bg-[#E2E8F0] rounded-md gap-1 px-2 py-1 h-10.5">
      <div
        v-for="tab in items"
        :key="tab.value"
        :class="[
          'px-4 py-2 font-medium text-base transition-all duration-200 cursor-pointer rounded-sm h-8.5 flex items-center justify-center whitespace-nowrap',
          modelValue === tab.value
            ? 'bg-primary text-white text-sm font-medium'
            : 'bg-transparent text-[#62748E] hover:text-gray-800 text-sm font-medium'
        ]"
        @click="emit('update:modelValue', tab.value)">
        {{ tab.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TabItem {
  value: string
  label: string
  [key: string]: any
}

interface Props {
  modelValue: string
  items: TabItem[]
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped></style>
