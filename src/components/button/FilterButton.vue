<template>
  <Button class="bg-white! btn flex items-center hover:bg-gray-100!">
    <Icon
      class="size-5 text-font-gray"
      icon="mynaui:filter-solid" />
    <div class="text-sm font-medium text">
      ตัวกรอง
    </div>
  </Button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<style scoped>
.text {
  color: var(--color-font-gray) !important;
}
.btn {
  border: 1px solid var(--color-font-gray) !important;
}
</style>
