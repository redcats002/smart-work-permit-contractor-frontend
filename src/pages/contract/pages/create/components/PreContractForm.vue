<template>
  <BaseContainer>
    <ModalEmployeeSelection
      v-model="model.sellManId"
      :form="form"
      label="พนักงานประเมิน"
      name="sellManId"
      placeholder="เลือกพนักงานประเมิน"
      hide-error
      hide-filter
      required />
  </BaseContainer>
  <BaseContainer>
    <div class="flex flex-col gap-4">
      <ModalCustomerSelection
        v-model="model.customerId"
        :disabled="disableCustomer"
        :form="form"
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
    v-for="(item, index) in model.preAssets"
    :key="item.key"
    v-model="model.preAssets[index]"
    v-model:form-key="formKey"
    :asset-category="assetCategory"
    :form="form"
    :name-prefix="`preAssets.${index}`"
    @delete="onRemoveAsset(index)"
    @mount="formKey++" />
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
</template>

<script setup lang="ts">
import type { IFormState } from '@/models/Form.model'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import ModalCustomerSelection from '@/components/selection/modules/api/customer/ModalCustomerSelection.vue'
import ModalEmployeeSelection from '@/components/selection/modules/api/employee/ModalEmployeeSelection.vue'
import { Icon } from '@iconify/vue'
import type { PreContractFormValues, TAssetCategory } from '../schema/pre-contract.schema'
import AssetFormSection from './AssetFormSection.vue'
import CustomerCard from './CustomerCard.vue'

interface IProps {
  form: IFormState
  selectedCustomer: ICustomerById | null
  assetCategory: TAssetCategory
  canAddAsset: boolean
  disableCustomer?: boolean
  onCustomerSelect: (id?: TBaseParamsId | null) => Promise<void>
  onAddAsset: () => void
  onRemoveAsset: (index: number) => void
}

withDefaults(defineProps<IProps>(), {
  disableCustomer: false
})

const model = defineModel<PreContractFormValues>({ required: true })
const formKey = defineModel<number>('formKey', { required: true })
</script>

<style scoped></style>
