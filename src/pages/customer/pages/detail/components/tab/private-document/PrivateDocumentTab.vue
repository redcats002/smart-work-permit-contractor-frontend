<template>
  <div class="grid gap-2.5">
    <BaseContainer>
      <DisplayList :items="citizenItems" />
    </BaseContainer>
    <BaseContainer>
      <DisplayList :items="payrollItems" />
    </BaseContainer>
    <BaseContainer>
      <DisplayList :items="otherItems" />
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'

const citizenItems = computed((): IDisplayList[] => {
  return [
    { label: 'บัตรประชาชน', key: 'citizenCardFile', value: '' },
    { label: 'จุดจัดเก็บเอกสาร', key: 'citizenCardStoredAt', value: '' }
  ]
})
const payrollItems = computed((): IDisplayList[] => {
  return [
    { label: 'สลิปเงินเดือน / หนังสือรับรองรายได้', key: 'payrollFile', value: '' },
    { label: 'จุดจัดเก็บเอกสาร', key: 'payrollStoredAt', value: '' }
  ]
})
const otherItems = computed((): IDisplayList[] => {
  return [
    { label: 'เอกสารอื่น ๆ', key: 'otherDocumentFile', value: '' },
    { label: 'จุดจัดเก็บเอกสาร', key: 'otherDocumentStoredAt', value: '' }
  ]
})


</script>

<style scoped>

</style>
