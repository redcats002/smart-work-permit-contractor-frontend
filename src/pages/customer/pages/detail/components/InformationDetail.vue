<template>
  <BaseContainer>
    <template #topright>
      <CustomerDetailMenuAction
        @delete="emits('delete')"
        @edit="emits('edit')" />
    </template>
    <CustomerCard
      :data="data"
      hide-border />
  </BaseContainer>
</template>

<script setup lang="ts">
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import CustomerCard from '@/pages/contract/pages/create/components/CustomerCard.vue'
import CustomerDetailMenuAction from './CustomerDetailMenuAction.vue'

interface IProps {
  data: ICustomerById
}
interface IEmits {
  edit: []
  delete: []
}

defineProps<IProps>()
const emits = defineEmits<IEmits>()


</script>

<style scoped>

</style>
