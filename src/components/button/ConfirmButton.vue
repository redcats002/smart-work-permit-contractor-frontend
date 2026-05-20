<template>
  <Button
    :class="buttonClass"
    :type="type"
    v-bind="$attrs"
    class="flex items-center rounded-sm!
    h-10.5 w-full md:w-49.5
    text-white transition-all duration-200">
    <div class="text-sm font-medium">
      {{ label }}
    </div>
  </Button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  label?: string
  mode?: 'delete' | 'submit' | ''
  type?: 'submit' | 'button'
}

const props = withDefaults(defineProps<IProps>(), {
  label: 'บันทึก',
  mode: '',
  type: 'submit'
})

const buttonClass = computed((): string => {
  switch (props.mode) {
    case 'delete':
      return 'bg-[#FB2C36]! hover:bg-red-600'
    case 'submit':
      return 'bg-[#00C16A]! hover:bg-[#00B35F] border border-[#00C16A]!'
    default:
      return 'bg-primary'
  }
})
</script>
