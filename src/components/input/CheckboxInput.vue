<template>
  <div class="flex items-center gap-2">
    <Checkbox
      v-model="model"
      :indeterminate="indeterminate"
      :pt="pt"
      binary />
    <label class="text-sm font-medium text-[#314158]">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// import MinusIcon from '@primevue/icons/minus'
import Checkbox from 'primevue/checkbox'

type Variant = 'default' | 'primary'

interface IProps {
  label?: string
  variant?: Variant
  indeterminate?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  variant: 'default',
  label: '',
  indeterminate: false
})

const model = defineModel<boolean>({ default: false })

const pt = computed((): any => {
  const base = {
    root: 'relative inline-flex select-none w-4 h-4 align-bottom cursor-pointer',
    input: `peer cursor-pointer appearance-none
        absolute start-0 top-0 w-full h-full m-0 p-0 opacity-0 z-10
        border border-transparent rounded`,
    box: `flex justify-center items-center rounded w-4 h-4
        border-2 border-surface-300 bg-white text-white
        transition-colors duration-200`
  }

  if (props.variant === 'primary') {
    return {
      ...base,
      box: `
        ${base.box}
        border-slate-200
        peer-hover:border-primary border-primary
        p-checked:bg-primary
        p-checked:border-primary
        p-checked:text-white
        [[data-p-indeterminate]_&]:bg-primary
        [[data-p-indeterminate]_&]:border-primary
      `
    }
  }

  // default
  return {
    ...base,
    box: `
      ${base.box}
      peer-hover:border-primary-400
      p-checked:bg-primary-800
      p-checked:border-primary-800
      [[data-p-indeterminate]_&]:bg-primary-800
      [[data-p-indeterminate]_&]:border-primary-800
    `
  }
})
</script>
