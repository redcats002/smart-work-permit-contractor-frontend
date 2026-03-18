<template>
  <Button
    :as="to ? RouterLink : 'button'"
    :to="to"
    class="bg-white! text-[#333333]! px-4 border-[#E2E8F0]! flex items-center hover:bg-gray-100!">
    <Icon
      class="size-5 text-[#62748E]"
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
