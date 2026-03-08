<template>
  <BaseContainer>
    <DisplayList :items="items" />
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'

interface IProps {
  data: ICustomerById
}

const props = defineProps<IProps>()

const items = computed((): IDisplayList[] => {
  return [
    { label: 'ที่อยู่ตามบัตรประจำตัวประชาชน', key: 'idCard', value: props?.data?.idCard || '-' },
    { label: 'ที่อยู่ปัจจุบัน', key: 'currentAddress', value: formatter.fullAddress(props?.data?.currentAddress) || '-' },
    { label: 'สถานที่ประกอบอาชีพ', key: 'workplaceAddress', value: formatter.fullAddress(props?.data?.workAddress) || '-' }
  ]
})


</script>

<style scoped>

</style>
