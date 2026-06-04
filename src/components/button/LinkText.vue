<template>
  <span
    v-if="isValidLink"
    class="flex">
    <router-link
      :to="to"
      class="text-primary text-sm flex items-center font-bold
    hover:underline hover:opacity-80 transition">
      <slot />
    </router-link>
  </span>
  <span
    v-else
    class="text-sm flex items-center font-bold">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

interface IProps {
  to: RouteLocationRaw
  id?: string | number
}

const props = defineProps<IProps>()

const isValidLink = computed((): boolean => {
  if (!props.to) return false
  if (typeof props.to === 'string') return !!props.to
  const routeObj = props.to as { params?: Record<string, unknown> }
  if (routeObj.params && 'id' in routeObj.params) {
    return !!routeObj.params.id
  }
  return true
})
</script>
