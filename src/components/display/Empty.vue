<template>
  <div
    :class="[
      'flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-surface-300 bg-surface-50/70 px-4 py-8 text-center md:px-6 md:py-10',
      compact ? 'min-h-40 gap-3' : 'min-h-56 gap-4'
    ]">
    <div class="flex size-14 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-surface-200">
      <Icon
        :icon="icon"
        class="size-7" />
    </div>

    <div class="space-y-1">
      <p class="text-lg font-semibold text-surface-800">
        {{ title }}
      </p>
      <p
        v-if="description"
        class="mx-auto max-w-md text-sm leading-6 text-surface-500">
        {{ description }}
      </p>
    </div>

    <div
      v-if="$slots.default"
      class="flex flex-wrap items-center justify-center gap-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface IProps {
  title?: string
  description?: string
  icon?: string
  compact?: boolean
}

withDefaults(defineProps<IProps>(), {
  title: 'ไม่มีข้อมูล',
  description: 'ยังไม่มีข้อมูลสำหรับแสดงในส่วนนี้',
  icon: 'solar:inbox-line-outline',
  compact: false
})
</script>
