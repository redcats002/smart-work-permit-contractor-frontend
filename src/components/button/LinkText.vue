<template>
  <router-link
    :to="to"
    class="text-primary text-sm flex items-center font-bold
    hover:underline hover:opacity-80 transition">
    <slot />
  </router-link>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

interface IProps {
  to: RouteLocationRaw
}


defineProps<IProps>()
</script>
