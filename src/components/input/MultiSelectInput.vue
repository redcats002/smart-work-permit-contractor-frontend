<template>
  <MultiSelect
    v-bind="attrs"
    display="chip"
    filter
    fluid />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<style scoped>

</style>
