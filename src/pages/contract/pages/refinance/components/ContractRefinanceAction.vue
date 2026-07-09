<template>
  <div class="flex justify-start gap-2.5">
    <ConfirmModal
      @confirm="emits('makeContract')">
      <template #activator="{ open }">
        <ConfirmButton
          :disabled="disabled"
          label="ยืนยัน"
          @click="open()" />
      </template>
    </ConfirmModal>
    <DeleteModal
      confirm-label="ยืนยัน"
      description1="คุณต้องการยกเลิกการสร้างสัญญาใหม่ใช่หรือไม่?"
      description2=""
      label="ยกเลิกการสร้างสัญญาใหม่"
      @confirm="emits('cancel')">
      <template #activator="{ open }">
        <CancelButton
          theme="primary"
          outlined
          @click="open()" />
      </template>
    </DeleteModal>
  </div>
</template>

<script setup lang="ts">
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import CancelButton from '@/components/button/CancelButton.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import DeleteModal from '@/components/modal/DeleteModal.vue'

interface IProps {
  disabled?: boolean
  status?: TContractStatus
}
interface IEmits {
  cancel: []
  makeContract: []
}

withDefaults(defineProps<IProps>(), {
  status: 'PENDING_REFINANCE',
  disabled: false
})
const emits = defineEmits<IEmits>()

</script>

<style scoped>

</style>
