<template>
  <section id="contract-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <ContractDetailMenuAction
        :status="contract.status"
        @delete="onCancelled()"
        @edit="onEdit()"
        @print="onPrint()" />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 gap-2.5">
        <InformationDetail
          :data="contract"
          @delete="onCancelled()"
          @edit="onEdit()" />
        <ContractTab :data="contract" />
      </div>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IContractProvider } from '@/resources/provider/contract/Contract.provider'
import ContractProvider from '@/resources/provider/contract/Contract.provider'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ContractDetailMenuAction from '../components/ContractDetailMenuAction.vue'
import InformationDetail from '../components/InformationDetail.vue'
import ContractTab from '../components/tab/ContractTab.vue'
import { useInitDetail } from '../composables/useInitDetail'

const route = useRoute()
const router = useRouter()

const ContractService: IContractProvider = new ContractProvider()

const contract = useInitDetail()
const contractId = computed((): number => Number(route?.params?.id as string ?? ''))

async function useFetch (): Promise<void> {
  const { data } = await ContractService.getContractFindOne(contractId.value)
  contract.value = useInitDetail(data).value
}

async function useCancelled (): Promise<void> {
  if (!contractId.value) throw new Error('Contract ID is required for deletion')
  if (contract.value.status === 'CANCELLED') {
    toast.error('สัญญานี้ถูกยกเลิกไปแล้ว')
    return
  }
  await ContractService.cancelledContract(contractId.value)
  toast.success('ยกเลิกสัญญาสำเร็จ')
  await useFetch()
}

function fetch (): void {
  handleLoading(useFetch)
}

function onEdit (): void {
  if (contract.value.status === 'CANCELLED') {
    toast.error('สัญญานี้ถูกยกเลิกไปแล้ว')
    return
  }
  router.push({ name: 'ContractEditPage', params: { id: contractId.value } })
}

function onCancelled (): void {
  handleLoading(useCancelled)
}

function onPrint (): void {
  router.push({ name: 'ContractPrintPage', params: { id: contractId.value } })
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
