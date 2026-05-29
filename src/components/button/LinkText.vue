<template>
  <router-link
    v-if="id"
    :to="to"
    class="text-primary text-sm flex items-center font-bold
    hover:underline hover:opacity-80 transition">
    <slot />
  </router-link>
  <span
    v-else
    class="text-sm flex items-center font-bold">
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

interface IProps {
  to: RouteLocationRaw
  id?: string | number
}


defineProps<IProps>()
</script>
