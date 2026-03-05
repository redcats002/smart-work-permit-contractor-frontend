<template>
  <div>
    <slot
      v-if="$slots.default"
      :component="activeComponent"
      :item="activeItem"
      :props="activeProps" />
    <component
      :is="activeComponent"
      v-else-if="activeComponent"
      v-bind="activeProps" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TabItem {
  value: string
  label: string
  component: any
  props?: Record<string, any>
}

interface Props {
  modelValue: string
  items: TabItem[]
}

const props = defineProps<Props>()

const activeItem = computed((): TabItem | undefined => {
  return props.items.find((i: TabItem): boolean => i.value === props.modelValue) ?? props.items[0]
})

const activeComponent = computed((): any => {
  const comp = activeItem.value?.component
  return comp?.instance || comp
})

const activeProps = computed((): Record<string, any> => {
  const item = activeItem.value
  const comp = item?.component
  return comp?.props || item?.props || {}
})
</script>
