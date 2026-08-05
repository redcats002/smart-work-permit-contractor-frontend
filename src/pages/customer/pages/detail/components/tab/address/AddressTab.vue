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
  const individual: IDisplayList[] = [
    { label: 'ที่อยู่ตามบัตรประจำตัวประชาชน', key: 'mainAddress', value: formatter.fullAddress(props?.data?.mainAddress) || '-' },
    { label: 'ที่อยู่ปัจจุบัน', key: 'currentAddress', value: formatter.fullAddress(props?.data?.currentAddress) || '-', extUrl: props.data?.currentAddress?.urlGoogleMap },
    { label: 'สถานที่ประกอบอาชีพ', key: 'workplaceAddress', value: formatter.fullAddress(props?.data?.workAddress) || '-', extUrl: props.data?.workAddress?.urlGoogleMap }
  ]
  const cooperate: IDisplayList[] = [{ label: 'ที่อยู่', key: 'mainAddress', value: formatter.fullAddress(props?.data?.mainAddress) || '-' }]
  if (props.data?.personalType === 'INDIVIDUAL') return individual
  return cooperate
})


</script>

<style scoped>

</style>
