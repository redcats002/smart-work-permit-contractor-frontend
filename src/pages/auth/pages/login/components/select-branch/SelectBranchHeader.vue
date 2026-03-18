<template>
  <div class="grid grid-cols-1 gap-4 mb-6">
    <div><BackButton @click="emits('back')" /></div>
    <h2 class="text-2xl font-bold text-center text-font-gray">
      เลือกสาขาที่คุณต้องการเข้าใช้งาน
    </h2>
  </div>
</template>

<script setup lang="ts">
import BackButton from '@/components/button/BackButton.vue'

interface IEmits {
  back: []
}
const emits = defineEmits<IEmits>()
</script>

<style scoped>

</style>
