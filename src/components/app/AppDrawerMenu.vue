<template>
  <RouterLink
    v-slot="{ isActive, isExactActive }"
    :to="to">
    <div
      :class="[
        'flex items-center p-2 rounded duration-200 hover:bg-(--p-gray-5) gap-2',
        (isActive || isExactActive) && 'bg-(--p-red)! text-white!'
      ]">
      <Icon :name="getIconName(isActive, isExactActive)" />
      <span class="grow">
        {{ label }}
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

interface IProps {
  label: string
  icon: string
  activeIcon?: string
  to: RouteLocationRaw
}

const props = defineProps<IProps>()

function getIconName (isActive: boolean, isExactActive: boolean): string {
  return isActive || isExactActive
    ? props.activeIcon || props.icon
    : props.icon
}
</script>
