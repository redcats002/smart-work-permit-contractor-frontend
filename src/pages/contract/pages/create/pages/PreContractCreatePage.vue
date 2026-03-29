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
        <BaseContainer>
          <ModalEmployeeSelection
            v-model="form.sellManId"
            :form="$form"
            label="พนักงานประเมิน"
            name="sellManId"
            placeholder="เลือกพนักงานประเมิน"
            hide-error
            required />
        </BaseContainer>
        <BaseContainer>
          <div class="flex flex-col gap-4">
            <ModalCustomerSelection
              v-model="form.customerId"
              :form="$form"
              label="ลูกค้า"
              name="customerId"
              placeholder="เลือกลูกค้า"
              hide-error
              required
              @update:model-value="onCustomerSelect($event)" />
            <CustomerCard
              v-if="selectedCustomer"
              :data="selectedCustomer" />
          </div>
        </BaseContainer>
        <AssetFormSection
          v-for="(item, index) in form.preAssets"
          :key="item.key"
          v-model="form.preAssets[index]"
          v-model:form-key="formKey"
          :asset-category="assetCategory"
          :form="$form"
          :name-prefix="`preAssets.${index}`"
          @delete="onRemoveAsset(index)"
          @mount="mount()" />
        <Button
          v-show="canAddAsset"
          class="flex items-center justify-start gap-1.5 py-4 text-sm text-primary! font-medium hover:opacity-80 transition-opacity bg-white!"
          type="button"
          fluid
          text
          @click="onAddAsset()">
          <Icon
            class="size-5"
            icon="mdi:plus" />
          เพิ่มหลักทรัพย์ในสัญญา
        </Button>
        <PreContractDraftAction
          @cancel="onCancel()"
          @set-submit-mode="setSubmitMode($event)" />
      </Form>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import DevButton from '@/components/button/DevButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ModalCustomerSelection from '@/components/selection/modules/api/customer/ModalCustomerSelection.vue'
import ModalEmployeeSelection from '@/components/selection/modules/api/employee/ModalEmployeeSelection.vue'
import AssetFormSection from '../components/AssetFormSection.vue'
import CustomerCard from '../components/CustomerCard.vue'
import PreContractDraftAction from '../components/PreContractDraftAction.vue'
import { Icon } from '@iconify/vue'
import { Form } from '@primevue/forms'
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
  onInitSellMan,
  mount
} = useInit()


onMounted((): void => {
  onInitSellMan()
})
</script>
