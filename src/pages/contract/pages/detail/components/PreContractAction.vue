<template>
  <div class="flex justify-start gap-2.5">
    <ModalAssetValuation
      v-model="requestReappraisal"
      @submit="emits('confirm')" />
    <CancelButton
      @click="emits('cancel')" />
  </div>
</template>

<script setup lang="ts">
import type { IRequestReappraisalPayload } from '@/models/request/pre-contract/PreContractReq.model'
import CancelButton from '@/components/button/CancelButton.vue'
import ModalAssetValuation from './ModalAssetValuation.vue'

interface IEmits {
  cancel: []
  confirm: []
}

const emits = defineEmits<IEmits>()

const requestReappraisal = defineModel<IRequestReappraisalPayload>('requestReappraisal', { required: true })

</script>

<style scoped>

</style>
