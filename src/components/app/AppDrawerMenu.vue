<template>
  <router-link
    v-slot="{ isActive, isExactActive, navigate }"
    :to="to"
    custom>
    <div
      :class="[
        'flex items-center p-2 rounded duration-200 hover:bg-(--p-gray-5) gap-2 cursor-pointer',
        (isActive || isExactActive) && !disabled && 'bg-(--p-red)! text-white!',
        disabled && 'cursor-not-allowed opacity-50 pointer-events-none'
      ]"
      @click="!disabled && navigate($event)">
      <img
        v-if="isImageIcon"
        :class="(isActive || isExactActive) && !disabled && 'brightness-0 invert'"
        :src="icon"
        class="w-5 h-5">
      <Icon
        v-else
        :class="[
          'size-5',
          (isActive || isExactActive) && !disabled ? 'text-white' : 'text-surface-700'
        ]"
        :icon="icon" />
      <span class="grow">
        {{ label }}
      </span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'

interface IProps {
  label: string
  icon: string
  activeIcon?: string
  to: RouteLocationRaw
  disabled?: boolean
}

const props = defineProps<IProps>()

const isImageIcon = computed((): boolean => props.icon.startsWith('/'))
</script>
