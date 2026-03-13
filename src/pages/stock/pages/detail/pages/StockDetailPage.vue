<template>
  <section id="employee-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <StockDocsDetailMenuAction
        @delete="onDelete()"
        @edit="onEdit()" />
    </BaseTop>
    <BasePage class="flex flex-col gap-2.5">
      <InformationDetail
        :data="data" />
      <div class="flex justify-between items-center">
        <p class="text-center text-gray text-bold">
          เอกสารที่ต้องการย้าย
        </p>
      </div>
      <SelectedDocsTable
        v-model:pagination="pagination"
        v-model:sort-by="sortBy"
        v-model:sort-order="sortOrder"
        :is-edit="!isSuccess"
        :items="(form.items as IStockList[])"
        is-detail />
      <FormAction v-if="!isSuccess" />
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// import { toast } from '@/plugins/toast'
// import { handleLoading } from '@/utils/HandleLoading'
// import { Form, type FormSubmitEvent } from '@primevue/forms'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
// import FormAction from '@/components/button/FormAction.vue'
// import { scrollToFirstError } from '@/utils/HandleSubmit'
// import {
//   StockDocsSchema
// } from '../../create/schema/stockDocs.schema'
import { storeToRefs } from 'pinia'
// import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useStockDocsStore } from '@/stores/StockDocs'
// import BaseContainer from '@/components/base/BaseContainer.vue'
import StockDocsDetailMenuAction from '../components/StockDocsDetailMenuAction.vue'
import InformationDetail from '../components/InformationDetail.vue'
import type { IStockDocsById } from '@/models/response/stock/StockDocsRes.model'
import SelectedDocsTable from '../../create/components/SelectedDocsTable.vue'
import useList from '../../list/composables/useList'
import type { IStockList } from '@/models/response/stock/StockRes.model'
import { StockDocsStatusEnum } from '@/enums/modules/stock/StockDocsStatus.enum'
import FormAction from '@/components/button/FormAction.vue'
// import SelectedDocsTable from '../../create/components/SelectedDocsTable.vue'
// import StockProvider from '@/resources/provider/stock/Stock.provider'

const router = useRouter()
const stockDocsStore = useStockDocsStore()

// const StockService: IStockProvider = new StockProvider()

// const formKey = ref<number>(0)
const { form } = storeToRefs(stockDocsStore)
// const resolver = zodResolver(StockDocsSchema)

const {
  pagination,
  sortBy,
  sortOrder
} = useList()

const data = ref<IStockDocsById>(
  {
    docNo: 'LC-00001',
    transferDate: '2026-04-13T15:30:00',
    senderName: 'นางสาว โชติกา ประชายศิริกุล',
    originWarehouse: '',
    receiverName: '',
    receiveDate: '2026-04-13T15:30:00',
    destinationWarehouse: '',
    status: 'SUCCESS',
    id: 1,
    reason: 'ส่งไปสำนักงานใหญ่'
  }
)
onMounted((): void => {
  if (form.value.items.length === 0) {
    stockDocsStore.loadDevData()
  }
})

const isSuccess = computed((): boolean => {
  return data.value?.status === StockDocsStatusEnum.SUCCESS
})

function onDelete (): void {
  router.push({ name: 'StockDocsList' })
}

function onEdit (): void {
  router.push({ name: 'StockDocsList' })
}

</script>

<style scoped>

</style>
