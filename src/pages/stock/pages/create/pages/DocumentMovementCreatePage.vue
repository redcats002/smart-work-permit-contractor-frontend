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
          <p class="text-center text-gray font-bold">
            เอกสารที่ต้องการย้าย
          </p>
          <ModalStockDocsCreate
            v-model="visible"
            v-model:form="form"
            @delete="onRemoveItem($event)" />
        </div>
        <SelectedDocsTable
          v-model:pagination="pagination"
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :items="form.assets"
          is-preview
          @delete="onRemoveItem($event)" />
        <FormAction
          @cancel="onCancel()" />
      </Form>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IDocumentStorageProvider } from '@/resources/provider/document-storages/DocumentStorage.provider'
import DocumentStorageProvider from '@/resources/provider/document-storages/DocumentStorage.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import InformationForm from '../components/InformationForm.vue'
import ModalStockDocsCreate from '../components/ModalStockDocsCreate.vue'
import SelectedDocsTable from '../components/SelectedDocsTable.vue'
import { useDocumentMovement } from '@/pages/stock/pages/create/composables/useDocumentMovement'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import useList from '../../list/composables/asset/useList'
import { usePayload } from '../composables/usePayload'
import { DocumentMovementSchema } from '../schema/document-movement'

const router = useRouter()

const DocumentStorageService: IDocumentStorageProvider = new DocumentStorageProvider()

const resolver = zodResolver(DocumentMovementSchema)
const { form, formKey, removeItem, resetForm } = useDocumentMovement()

const visible = ref<boolean>(false)
const {
  pagination,
  sortBy,
  sortOrder
} = useList()

async function useSubmit (): Promise<void> {
  await DocumentStorageService.createDocumentMovement(usePayload(form.value))
  toast.success('ดำเนินการสำเร็จ')
  resetForm()
  router.push({ name: 'DocumentMovementListPage' })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  await handleLoading(useSubmit)
}

function onRemoveItem (id: number): void {
  removeItem(id)
}

function onCancel (): void {
  router.push({ name: 'DocumentMovementListPage' })
}

onMounted((): void => {})

</script>

<style scoped>

</style>
