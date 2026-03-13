<template>
  <div class="flex justify-start gap-2.5">
    <template v-if="isAssetValuation">
      <ModalAssetValuation
        v-model="requestReappraisal"
        @submit="emits('requestReappraisal')" />
    </template>
    <template v-else-if="isConfirmValuation">
      <ConfirmModal @confirm="emits('confirmAppraisal')">
        <template #activator="{ open }">
          <ConfirmButton
            label="ยืนยันราคาประเมิน"
            @click="open()" />
        </template>
      </ConfirmModal>
      <ModalAssetValuation
        v-model="requestReappraisal"
        request-new
        @submit="emits('requestReappraisal')" />
    </template>
    <template v-else-if="isSubmitMortgage">
      <ConfirmModal
        v-if="!isMortgageFormVisible"
        @confirm="emits('submitMortgage')">
        <template #activator="{ open }">
          <ConfirmButton
            label="ยื่นจำนอง/ทำสัญญา"
            @click="open()" />
        </template>
      </ConfirmModal>
      <ConfirmModal
        v-else
        @confirm="emits('confirmMortgage')">
        <template #activator="{ open }">
          <ConfirmButton
            label="ยืนยัน"
            @click="open()" />
        </template>
      </ConfirmModal>
    </template>
    <template v-else-if="isWaitContract">
      <ConfirmModal
        @confirm="emits('makeContract')">
        <template #activator="{ open }">
          <ConfirmButton
            label="ยืนยัน"
            @click="open()" />
        </template>
      </ConfirmModal>
    </template>
    <CancelButton
      theme="primary"
      outlined
      @click="emits('cancel')" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IRequestReappraisalPayload } from '@/models/request/pre-contract/PreContractReq.model'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import CancelButton from '@/components/button/CancelButton.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import ModalAssetValuation from './ModalAssetValuation.vue'

interface IProps {
  status: TPreContractStatus
  isMortgageFormVisible?: boolean
}
interface IEmits {
  cancel: []
  requestReappraisal: []
  confirmAppraisal: []
  submitMortgage: []
  confirmMortgage: []
  makeContract: []
}

const props = withDefaults(defineProps<IProps>(), {
  status: 'DRAFT',
  isMortgageFormVisible: false
})
const emits = defineEmits<IEmits>()

const requestReappraisal = defineModel<IRequestReappraisalPayload>('requestReappraisal', { required: true })

const isAssetValuation = computed((): boolean => {
  const list: TPreContractStatus[] = ['PENDING', 'DRAFT']
  return list.includes(props.status)
})
const isConfirmValuation = computed((): boolean => {
  const list: TPreContractStatus[] = ['IN_ASSESSMENT']
  return list.includes(props.status)
})
const isSubmitMortgage = computed((): boolean => {
  const list: TPreContractStatus[] = ['WAIT_MORTGAGE']
  return list.includes(props.status)
})
const isWaitContract = computed((): boolean => {
  const list: TPreContractStatus[] = ['WAIT_CONTRACT']
  return list.includes(props.status)
})
</script>

<style scoped>

</style>
