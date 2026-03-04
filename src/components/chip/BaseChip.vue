<template>
  <div
    :class="wrapperClass"
    class="w-fit h-8 border rounded-md flex items-center gap-1 p-2 py-1.25">
    <icon :icon="appendIcon" />
    <p
      :class="textClass"
      class="text-[14px]">
      {{ label }}
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  label: string
  appendIcon?: string
  wrapperClass?: string
  textClass?: string
}

withDefaults(defineProps<Props>(), {
  appendIcon: '',
  wrapperClass: '',
  textClass: ''
})
</script>
