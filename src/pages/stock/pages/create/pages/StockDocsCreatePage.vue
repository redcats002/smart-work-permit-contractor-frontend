<template>
  <section id="employee-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
    </BaseTop>
    <BasePage>
      <Form
        :key="formKey"
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="flex flex-col gap-5"
        @submit="onSubmit($event)">
        <BaseContainer>
          <InformationForm
            v-model="form"
            :form="$form" />
        </BaseContainer>
        <div class="flex justify-between items-center">
          <p class="text-center text-gray text-bold">
            เอกสารที่ต้องการย้าย
          </p>
          <CreateButton
            :to="{ name: 'StockDocsSelectPage' }"
            label="เพิ่มเอกสารที่ต้องการย้าย" />
        </div>
        <SelectedDocsTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="(form.items as IStockList[])"
          @delete="handleRemoveItem($event)" />
        <FormAction @cancel="onCancel()" />
      </Form>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationForm from '../components/InformationForm.vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import FormAction from '@/components/button/FormAction.vue'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import {
  // useDev,
  // useFormInitialValues,
  StockDocsSchema
  // type StockDocsFormValues
} from '../schema/stockDocs.schema'
import { storeToRefs } from 'pinia'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import useList from '../../list/composables/useList'
import type { IStockList } from '@/models/response/stock/StockRes.model'
import CreateButton from '@/components/button/CreateButton.vue'
import SelectedDocsTable from '../components/SelectedDocsTable.vue'
import { useStockDocsStore } from '@/stores/StockDocs'
// import StockProvider from '@/resources/provider/stock/Stock.provider'

const router = useRouter()
const stockDocsStore = useStockDocsStore()

// const StockService: IStockProvider = new StockProvider()

const formKey = ref<number>(0)
const { form } = storeToRefs(stockDocsStore)
const resolver = zodResolver(StockDocsSchema)

const {
  pagination,
  sortBy,
  sortOrder
} = useList()

onMounted((): void => {
  if (form.value.items.length === 0) {
    stockDocsStore.loadDevData()
  }
})

async function useSubmit (): Promise<void> {
  // await StockService.createStock(usePayload(form.value))
  toast.success('ดำเนินการสำเร็จ')
  stockDocsStore.resetForm()
  router.push({ name: 'EmployeeListPage' })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  await handleLoading(useSubmit)
}

function onCancel (): void {
  router.push({ name: 'EmployeeListPage' })
}

function handleRemoveItem (id: number): void {
  stockDocsStore.removeItem(id)
}
</script>

<style scoped>

</style>
