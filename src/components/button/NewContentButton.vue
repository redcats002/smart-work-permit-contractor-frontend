<template>
  <Transition name="slide-down">
    <button
      v-if="show"
      class="fixed top-16 md:top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full shadow-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
      type="button"
      @click="emits('click')">
      <Icon
        class="size-4"
        icon="mdi:refresh" />
      {{ label }}
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface IProps {
  show: boolean
  label: string
}

interface IEmits {
  click: []
}

defineProps<IProps>()
const emits = defineEmits<IEmits>()
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-200%);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
