<template>
  <div class="flex items-center gap-5">
    <Button
      class="bg-bg-primary! hover:bg-primary-600! flex items-center justify-center rounded-sm! h-10.5 text-white transition-all duration-200 grow w-full"
      @click="emits('search')">
      <span class="text-sm font-medium">ยืนยัน</span>
    </Button>
    <Button
      class="bg-white! text-[#333333]! border-font-gray! flex items-center justify-center hover:bg-gray-100! h-10.5 grow w-full"
      @click="emits('clear')">
      <span class="text-sm font-medium">ล้างค่า</span>
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
