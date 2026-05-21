<template>
  <div
    :class="{
      'w-full': full
    }"
    class="max-w-full overflow-x-auto">
    <div
      :class="[
        full ? 'flex w-full' : 'inline-flex min-w-max',
        'bg-white rounded-md gap-1 px-2 py-1 h-10.5'
      ]">
      <div
        v-for="tab in items"
        :key="tab.value"
        :class="[
          'flex-1 px-4 py-2 font-medium text-base transition-all duration-200 cursor-pointer h-8.5 flex items-center justify-center whitespace-nowrap border-b-2',
          modelValue === tab.value
            ? ' text-black text-sm font-medium border-b-2 border-primary text-black'
            : 'bg-transparent text-[#62748E] hover:text-gray-800 text-sm font-medium border-b-2 border-transparent'
        ]"
        @click="handleClick(tab.value)">
        {{ tab.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

export interface ITabItem {
  label: string
  value: string
  [key: string]: any
}

interface IProps {
  modelValue: string
  items: ITabItem[]
  full?: boolean
}
interface IEmits {
  'update:modelValue': [value: string]
}

defineProps<IProps>()
const emits = defineEmits<IEmits>()

const router = useRouter()

function handleClick (value: string): void {
  emits('update:modelValue', value)
  router.replace({ query: { tab: value } })
}
</script>

<style scoped></style>
