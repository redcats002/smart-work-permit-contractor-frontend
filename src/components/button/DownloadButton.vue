<template>
  <Button class="bg-white! text-[#333333]! border-[#E2E8F0]! flex items-center hover:bg-gray-100!">
    <Icon
      class="size-5 text-[#62748E]"
      icon="lucide:hard-drive-download" />
    <div class="text-sm font-medium">
      ดาวโหลด
      <span v-if="count">({{ count }})</span>
    </div>
  </Button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface IProps {
  count?: number
}

withDefaults(defineProps<IProps>(), {
  count: undefined
})

</script>

<style scoped>

</style>
