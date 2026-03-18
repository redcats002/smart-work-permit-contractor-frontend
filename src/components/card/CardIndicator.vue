<template>
  <BaseContainer class="flex flex-col items-center justify-center gap-1 py-6">
    <span :class="['text-4xl', valueClass, 'font-bold']">{{ value }}</span>
    <span :class="['text-sm', labelClass]">{{ label }}</span>
  </BaseContainer>
</template>

<script setup lang="ts">
import BaseContainer from '../base/BaseContainer.vue'

export interface ICardIndicator {
  label: string
  value?: any
  labelClass?: string
  valueClass?: string
}

interface IProps extends ICardIndicator {}

withDefaults(defineProps<IProps>(), {
  value: null,
  labelClass: '',
  valueClass: ''
})
</script>

<style scoped></style>
