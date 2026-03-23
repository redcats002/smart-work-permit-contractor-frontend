<template>
  <ConfirmButton
    v-if="isDev"
    label="Auto" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ConfirmButton from './ConfirmButton.vue'

const isDev = computed((): boolean => {
  const devEnvs = ['local', 'dev']
  const isLocalhost = window.location.hostname === 'localhost'
  return import.meta.env.DEV || devEnvs.includes(import.meta.env.VITE_APP_ENV) || isLocalhost
})

</script>

<style scoped>

</style>
