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
          <LabelField
            :invalid="!selectedCustomer"
            label="พนักงานประเมิน"
            name="sellManId"
            required>
            <EmployeeSelection
              v-model="form.sellManId"
              name="sellManId"
              placeholder="เลือกพนักงานประเมิน" />
          </LabelField>
        </BaseContainer>
        <BaseContainer>
          <div class="flex flex-col gap-4">
            <LabelField
              :invalid="!selectedCustomer"
              label="ลูกค้า"
              name="customerId"
              tag="div"
              required>
              <CustomerSelection
                v-model="form.customerId"
                name="customerId"
                placeholder="เลือกลูกค้า"
                @update:model-value="onCustomerSelect($event)" />
            </LabelField>
            <CustomerCard
              v-if="selectedCustomer"
              :data="selectedCustomer" />
          </div>
        </BaseContainer>
        <AssetFormSection
          v-for="(item, index) in form.preAssets"
          :key="item.key"
          v-model="form.preAssets[index]"
          :asset-category="assetCategory"
          :form="$form"
          :name-prefix="`preAssets.${index}`"
          @delete="onRemoveAsset(index)" />
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
        <div class="flex gap-3 flex-wrap">
          <ConfirmButton
            label="ยืนยัน/สั่งงานประเมิน"
            type="submit"
            @click="setSubmitMode('PENDING_EVALUATION')" />
          <Button
            class="bg-white! text-[#333333]! border-gray-400! flex items-center hover:bg-gray-100! w-49.5"
            label="ร่าง"
            type="submit"
            outlined
            @click="setSubmitMode('DRAFT')" />
          <Button
            class="w-49.5"
            label="ยกเลิก"
            outlined
            @click="onCancel()" />
        </div>
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
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import DevButton from '@/components/button/DevButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import LabelField from '@/components/input/LabelField.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import CustomerSelection from '@/components/selection/modules/customer/CustomerSelection.vue'
import EmployeeSelection from '@/components/selection/modules/employee/EmployeeSelection.vue'
import { Icon } from '@iconify/vue'
import { Form } from '@primevue/forms'
import AssetFormSection from '../../create/components/AssetFormSection.vue'
import CustomerCard from '../../create/components/CustomerCard.vue'
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
