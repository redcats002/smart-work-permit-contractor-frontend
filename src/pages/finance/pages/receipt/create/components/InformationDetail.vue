<template>
  <BaseContainer>
    <!-- Customer selection -->
    <div class="flex flex-col gap-1 mb-4">
      <div class="flex items-center gap-1 text-sm font-bold text-[#333]">
        <span>ลูกค้า</span>
        <span class="text-[#BD0102]">*</span>
      </div>
      <ModalCustomerSelection
        v-model="customerId"
        :disabled="!!customerIdQuery"
        placeholder="กรุณาเลือกลูกค้า"
        show-clear
        @update:model-value="onSelectionChange()" />
    </div>

    <!-- Customer details -->
    <CustomerCard
      v-if="data.id"
      :data="data"
      hide-border />
  </BaseContainer>
</template>

<script setup lang="ts">
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import ModalCustomerSelection from '@/components/selection/modules/api/customer/ModalCustomerSelection.vue'
import CustomerCard from '@/pages/contract/pages/create/components/CustomerCard.vue'

interface IProps {
  data: ICustomerById
  customerIdQuery?: number | null
}

interface IEmits {
  change: [id: number | null]
}

withDefaults(defineProps<IProps>(), {
  customerIdQuery: null
})
const emits = defineEmits<IEmits>()

const customerId = defineModel<number | null>('customerId', { default: null })

function onSelectionChange (): void {
  emits('change', customerId.value)
}
</script>

<style scoped>

</style>
