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
      <InformationDetail :data="data" />
      <Form
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="flex flex-col gap-2.5"
        @submit="onFormSubmit($event)">
        <div class="flex justify-between items-center">
          <p class="text-center text-gray font-bold">
            เอกสารที่ต้องการย้าย
          </p>
        </div>
        <DocumentMovementReceiveTable
          v-model="form"
          :form="$form"
          :is-success="isSuccess"
          :items="data.items"
          is-detail />
        <FormAction
          v-if="!isSuccess"
          @cancel="onCancel()" />
      </Form>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import DocumentMovementReceiveTable from '../components/DocumentMovementReceiveTable.vue'
import InformationDetail from '../components/InformationDetail.vue'
import StockDocsDetailMenuAction from '../components/StockDocsDetailMenuAction.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import useDetail from '../composables/useDetail'
import { DocumentReceiveSchema } from '../schema/document-receive.schema'

const resolver = zodResolver(DocumentReceiveSchema)
const { data, form, isSuccess, fetch, onCancel, onDelete, onEdit, onSubmit } = useDetail()

function onFormSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  onSubmit()
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
