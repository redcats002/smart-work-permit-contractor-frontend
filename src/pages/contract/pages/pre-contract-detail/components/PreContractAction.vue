<template>
  <div class="flex justify-start gap-2.5">
    <template v-if="isAssetValuation">
      <ModalAssetValuation
        v-model="requestAppraisal"
        :disabled="disabled"
        @submit="emits('requestAppraisal')" />
    </template>
    <template v-else-if="isConfirmValuation">
      <ModalConfirmAppraisal
        v-model="confirmAppraisal"
        @submit="emits('confirmAppraisal')" />
      <ModalAssetValuation
        v-model="requestReappraisal"
        :existed-group="existedGroup"
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
        @confirm="emits('preMakeContract')">
        <template #activator="{ open }">
          <ConfirmButton
            label="ยืนยัน"
            @click="open()" />
        </template>
      </ConfirmModal>
    </template>
    <template v-else-if="isPendingReview">
      <ConfirmModal
        @confirm="emits('makeContract')">
        <template #activator="{ open }">
          <ConfirmButton
            label="ยืนยันการสร้างสัญญา"
            @click="open()" />
        </template>
      </ConfirmModal>
    </template>
    <ConfirmModal
      v-if="status!=='CANCELLED'"
      label="ยกเลิกการประเมิน"
      @confirm="emits('cancel')">
      <template #activator="{ open }">
        <CancelButton
          :disabled="disabled"
          theme="primary"
          outlined
          @click="open()" />
      </template>
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IConfirmAppraisalPayload, IRequestReappraisalPayload } from '@/models/request/pre-contract/PreContractReq.model'
import type { TEvaluatorLevel } from '@/enums/modules/contract/EvaluatorLevel.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import CancelButton from '@/components/button/CancelButton.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'
import ModalAssetValuation from './appraisal/ModalAssetValuation.vue'
import ModalConfirmAppraisal from './appraisal/ModalConfirmAppraisal.vue'

interface IProps {
  disabled?: boolean
  status?: TPreContractStatus
  isMortgageFormVisible?: boolean
  existedGroup?: TEvaluatorLevel[]
}
interface IEmits {
  cancel: []
  requestAppraisal: []
  requestReappraisal: []
  confirmAppraisal: []
  submitMortgage: []
  confirmMortgage: []
  preMakeContract: []
  makeContract: []
}

const props = withDefaults(defineProps<IProps>(), {
  status: 'DRAFT',
  isMortgageFormVisible: false,
  existedGroup: (): TEvaluatorLevel[] => []
})
const emits = defineEmits<IEmits>()

const confirmAppraisal = defineModel<IConfirmAppraisalPayload>('confirmAppraisal', { required: true })
const requestAppraisal = defineModel<IRequestReappraisalPayload>('requestAppraisal', { required: true })
const requestReappraisal = defineModel<IRequestReappraisalPayload>('requestReappraisal', { required: true })

const isAssetValuation = computed((): boolean => {
  const list: TPreContractStatus[] = ['PENDING_EVALUATION', 'DRAFT']
  return list.includes(props.status)
})
const isConfirmValuation = computed((): boolean => {
  const list: TPreContractStatus[] = ['UNDER_EVALUATION']
  return list.includes(props.status)
})
const isSubmitMortgage = computed((): boolean => {
  const list: TPreContractStatus[] = ['PENDING_MORTGAGE']
  return list.includes(props.status)
})
const isWaitContract = computed((): boolean => {
  const list: TPreContractStatus[] = ['PENDING_CONTRACT']
  return list.includes(props.status)
})
const isPendingReview = computed((): boolean => {
  const list: TPreContractStatus[] = ['PENDING_REVIEW']
  return list.includes(props.status)
})
</script>

<style scoped>

</style>
