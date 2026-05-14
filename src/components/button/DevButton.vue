<template>
  <ConfirmButton
    v-if="isDev"
    label="Auto" />
</template>

<script setup lang="ts">
import useDev from '@/composables/useDev'
import ConfirmButton from './ConfirmButton.vue'

const { isDev } = useDev()

</script>

<style scoped>

</style>
