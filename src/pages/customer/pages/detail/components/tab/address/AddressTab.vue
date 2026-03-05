<template>
  <BaseContainer>
    <DisplayList :items="items" />
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'

const items = computed((): IDisplayList[] => {
  return [
    { label: 'ที่อยู่ตามบัตรประจำตัวประชาชน', key: 'citizenIdAddress', value: '' },
    { label: 'ที่อยู่ปัจจุบัน', key: 'currentAddress', value: '' },
    { label: 'สถานที่ประกอบอาชีพ', key: 'workplaceAddress', value: '' }
  ]
})


</script>

<style scoped>

</style>
