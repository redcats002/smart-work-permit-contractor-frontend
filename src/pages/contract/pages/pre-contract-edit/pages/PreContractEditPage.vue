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
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import DevButton from '@/components/button/DevButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import { Form } from '@primevue/forms'
import PreContractDraftAction from '../../create/components/PreContractDraftAction.vue'
import PreContractForm from '../../create/components/PreContractForm.vue'
import { useInit } from '../composables/useInit'

const {
  assetCategory,
  canAddAsset,
  form,
  formKey,
  selectedCustomer,
  resolver,
  onCustomerSelect,
  onSubmit,
  onAddAsset,
  onRemoveAsset,
  onCancel,
  setSubmitMode,
  onAuto,
  fetch
} = useInit()

onMounted((): void => {
  fetch()
})
</script>
