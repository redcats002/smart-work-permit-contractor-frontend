<template>
  <div
    v-if="props?.items.length"
    :dense="props.dense"
    :no-gutters="props.noGutters"
    class="grid grid-cols-1 gap-2.5">
    <div
      v-for="(item, i) in props.items"
      :key="`${item.label}-${i}`">
      <div
        class="flex items-center line-clamp-3"
        no-gutters>
        <Icon
          :color="getColor(item.valid)"
          :icon="getIcon(item.valid)"
          class="mr-1" />
        <span :class="[`text-${getColor(item.valid)}`]">
          {{ item?.label || '-' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

export interface IProgress {
  label: string
  valid: boolean
  icon?: string
}

interface IProps {
  items?: IProgress[]
  noGutters?: boolean
  dense?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  items: (): IProgress[] => [],
  dense: false,
  noGutters: false
})

function getIcon (value: boolean): string {
  return value ? 'mdi-check-circle' : 'mdi-close-circle'
}
function getColor (value: boolean): string {
  return value ? 'green' : 'red'
}
</script>

<style scoped></style>
