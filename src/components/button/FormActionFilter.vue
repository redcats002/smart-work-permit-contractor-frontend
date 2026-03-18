<template>
  <div class="flex items-center gap-5">
    <Button
      class="bg-white! text-[#333333]! border-[#E2E8F0]! flex items-center justify-center hover:bg-gray-100! min-w-50 h-10.5 px-6"
      @click="emits('clear')">
      <span class="text-sm font-medium">ล้างค่า</span>
    </Button>

    <Button
      class="bg-bg-primary! hover:bg-primary-600! flex items-center justify-center rounded-sm! h-10.5 w-full text-white transition-all duration-200"
      @click="emits('search')">
      <span class="text-sm font-medium">ค้นหา</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
interface IEmits {
  clear: []
  search: []
}

const emits = defineEmits<IEmits>()
</script>

<style scoped></style>
