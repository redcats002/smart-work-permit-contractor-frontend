<template>
  <Button
    :as="to ? RouterLink : 'button'"
    :to="to"
    class="bg-white! text-(--color-text-strong)! px-4 border-(--color-border)! flex items-center hover:bg-gray-100!">
    <Icon
      class="size-5 text-(--color-text-secondary)"
      icon="mdi:pencil" />
    <div class="text-sm font-medium">
      แก้ไข
    </div>
  </Button>
</template>

<script setup lang="ts">
import { type RouteLocationRaw, RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

interface IProps {
  to?: RouteLocationRaw
}
defineProps<IProps>()
</script>

<style scoped>

</style>
