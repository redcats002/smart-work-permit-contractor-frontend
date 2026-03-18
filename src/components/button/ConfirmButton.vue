<template>
  <Button
    :class="buttonClass"
    class="flex items-center rounded-sm! h-10.5 w-49.5 text-white transition-all duration-200"
    type="submit">
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
}

const props = withDefaults(defineProps<IProps>(), {
  label: 'บันทึก',
  mode: ''
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
