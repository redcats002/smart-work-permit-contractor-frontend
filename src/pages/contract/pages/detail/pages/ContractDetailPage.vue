<template>
  <section id="contract-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <div class="grid grid-cols-1 gap-2.5">
        <InformationDetail
          :data="contract"
          @delete="onDelete()"
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

async function useDelete (): Promise<void> {
  if (!contractId.value) throw new Error('Contract ID is required for deletion')
  await ContractService.deleteContract(contractId.value)
  toast.success('ดำเนินการสำเร็จ')
  router.push({ name: 'ContractListPage' })
}

function fetch (): void {
  handleLoading(useFetch)
}

function onEdit (): void {
  router.push({ name: 'ContractEditPage', params: { id: contractId.value } })
}

function onDelete (): void {
  handleLoading(useDelete)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
