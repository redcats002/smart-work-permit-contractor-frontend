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
import type { ITabItemComponent } from '@/composables/useTabItems'

interface ITabItem extends ITabItemComponent {
  value: string
  label: string
  props?: Record<string, any>
}

interface Props {
  modelValue: string
  items: ITabItem[]
}

const props = defineProps<Props>()

const activeItem = computed((): ITabItem | undefined => {
  return props.items.find((i: ITabItem): boolean => i.value === props.modelValue) ?? props.items[0]
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
