<template>
  <section id="pre-contract-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
      <Spacer />
      <DevButton
        @click="onAuto()" />
    </BaseTop>
    <BasePage>
      <Form
        :key="formKey"
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="flex flex-col gap-5 pb-10"
        @submit="onSubmit($event)">
        <PreContractForm
          v-model="form"
          v-model:form-key="formKey"
          :asset-category="assetCategory"
          :can-add-asset="canAddAsset"
          :disable-customer="!!customerIdQuery"
          :form="$form"
          :on-add-asset="onAddAsset"
          :on-customer-select="onCustomerSelect"
          :on-remove-asset="onRemoveAsset"
          :selected-customer="selectedCustomer" />
        <PreContractDraftAction
          @cancel="onCancel()"
          @set-submit-mode="setSubmitMode($event)" />
      </Form>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import DevButton from '@/components/button/DevButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import PreContractDraftAction from '../components/PreContractDraftAction.vue'
import PreContractForm from '../components/PreContractForm.vue'
import { Form } from '@primevue/forms'
import { useInit } from '../composables/useInit'

const router = useRouter()

const {
  assetCategory,
  canAddAsset,
  form,
  formKey,
  selectedCustomer,
  customerIdQuery,
  resolver,
  onCustomerSelect,
  onSubmit,
  onAddAsset,
  onRemoveAsset,
  onCancel,
  setSubmitMode,
  onAuto,
  onInitSellMan,
  onInitCustomer
} = useInit()


onMounted(async (): Promise<void> => {
  await router.isReady()
  onInitSellMan()
  onInitCustomer()
})
</script>
