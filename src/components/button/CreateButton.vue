<template>
  <Button
    :as="to ? RouterLink : 'button'"
    :to="to"
    class="flex items-center rounded-sm"
    outlined>
    <Icon
      class="size-5"
      icon="mdi:plus" />
    <div class="text-sm font-medium">
      {{ label }}
    </div>
  </Button>
</template>

<script setup lang="ts">
import { type RouteLocationRaw, RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

interface IProps {
  label: string
  to?: RouteLocationRaw
}
defineProps<IProps>()
</script>

<style scoped>

</style>
