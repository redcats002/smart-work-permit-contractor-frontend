<template>
  <Button
    :class="buttonClass"
    :type="type"
    v-bind="$attrs"
    class="flex items-center rounded-sm!
    h-10.5 w-full md:w-49.5
    text-white transition-all duration-200"
    data-testid="confirm-button">
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
      return 'bg-(--color-primary)! hover:bg-(--color-primary-emphasis)'
    case 'submit':
      return 'bg-(--color-status-active-fg)! hover:bg-(--color-status-active-fg-emphasis) border border-(--color-status-active-fg)!'
    default:
      return 'bg-primary'
  }
})
</script>
