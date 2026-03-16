<template>
  <RouterLink
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
        :class="(isActive || isExactActive) && !disabled && 'brightness-0 invert'"
        :src="icon"
        class="w-5 h-5">
      <span class="grow">
        {{ label }}
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'

interface IProps {
  label: string
  icon: string
  activeIcon?: string
  to: RouteLocationRaw
  disabled?: boolean
}

// const props = defineProps<IProps>()
defineProps<IProps>()

// function getIconName (isActive: boolean, isExactActive: boolean): string {
//   return isActive || isExactActive
//     ? props.activeIcon || props.icon
//     : props.icon
// }
</script>
