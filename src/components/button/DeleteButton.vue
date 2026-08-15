<template>
  <Button class="bg-white! text-(--color-text-strong)! px-4 border-(--color-border)! flex items-center hover:bg-gray-100!">
    <Icon
      class="size-5 text-(--color-text-secondary)"
      icon="mdi:trash-can" />
    <div class="text-sm font-medium">
      ลบ
    </div>
  </Button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<style scoped>

</style>
