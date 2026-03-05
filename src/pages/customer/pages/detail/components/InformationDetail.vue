<template>
  <BaseContainer>
    <DisplayList :items="items">
      <template #[`value.customerStatus`]>
        <ChipCustomerStatus />
      </template>
      <template #[`value.citizenId`]="{ value }">
        <span>{{ visibleCitizenId ? value : '*************' }}</span>
        <Icon
          :icon="visibleCitizenId ? 'famicons:eye-outline' : 'famicons:eye-off-outline'"
          class="cursor-pointer"
          color="#BD0102"
          @click="toggleVisibleCitizenId()" />
      </template>
    </DisplayList>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import { Icon } from '@iconify/vue'
import ChipCustomerStatus from '../../list/components/ChipCustomerStatus.vue'

const visibleCitizenId = ref<boolean>(true)

const items = computed((): IDisplayList[] => {
  return [
    { label: 'สถานะ', key: 'customerStatus', value: '', hideColon: true },
    { label: 'เลขที่ลูกค้า', key: 'customerNumber', value: '' },
    { label: 'เลขบัตรประชาชน', key: 'citizenId', value: '' },
    { label: 'ชื่อ', key: 'name', value: '' },
    { label: 'วันเดือนปีเกิด', key: 'birthDate', value: '' },
    { label: 'อายุ', key: 'age', value: '' },
    { label: 'กลุ่มลูกค้า', key: 'customerGroup', value: '' },
    { label: 'อาชีพ', key: 'occupation', value: '' },
    { label: 'เบอร์โทร', key: 'phoneNumber', value: '' },
    { label: 'อีเมล', key: 'email', value: '' }
  ]
})

function toggleVisibleCitizenId (): void {
  visibleCitizenId.value = !visibleCitizenId.value
}

</script>

<style scoped>

</style>
