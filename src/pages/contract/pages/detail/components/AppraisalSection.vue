<template>
  <div>
    <div class="flex justify-between items-center">
      <h5 class="font-bold text-base!">
        รายการประเมินหลักทรัพย์
      </h5>
      <ModalAppraisalPrice
        v-model="formAppraisalPrice"
        @submit="emits('submit')" />
    </div>
    <div class="grid grid-cols-1 gap-4">
      <AppraisalBody
        v-for="(item, i) in appraisals"
        :key="`appraisal-${i}`"
        :appraisal="item"
        :count="i+1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAppraisalPricePayload } from '@/models/request/pre-contract/PreContractReq.model'
import type { IAppraisalById } from '@/models/response/pre-contract/PreContractRes.model'
import AppraisalBody from './AppraisalBody.vue'
import ModalAppraisalPrice from './ModalAppraisalPrice.vue'

interface IEmits {
  submit: []
}
interface IProps {
  appraisals?: IAppraisalById[]
}

withDefaults(defineProps<IProps>(), {
  appraisals: (): IAppraisalById[] => []
})
const emits = defineEmits<IEmits>()

const formAppraisalPrice = defineModel<IAppraisalPricePayload>('appraisalPrice', { required: true })

</script>

<style scoped>

</style>
