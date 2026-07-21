<template>
  <BaseTop>
    <div>
      <SearchInput
        v-model="model"
        @search="onSearch()" />
    </div>
    <div>
      <BaseModal
        class="md:w-100!"
        label="ตัวกรอง">
        <template #activator="{ open }">
          <FilterButton @click="open()" />
        </template>
        <div class="grid grid-cols-1 gap-5">
          <LabelField
            label="ประเภทลูกหนี้ปิดบัญชี"
            placeholder="ทั้งหมด">
            <SelectInput
              v-model="filters.receiptType"
              :options="receiptTypeOptions"
              option-label="label"
              option-value="value"
              show-clear />
          </LabelField>
          <LabelField
            label="หมวดหมู่หลักทรัพย์"
            placeholder="ทั้งหมด">
            <SelectInput
              v-model="filters.assetType"
              :options="assetTypeOptions"
              option-label="label"
              option-value="value"
              show-clear />
          </LabelField>
        </div>
        <template #footer="{ close }">
          <FormActionFilter
            @clear="onClear(close)"
            @search="onModalSearch(close)" />
        </template>
      </BaseModal>
    </div>
    <Spacer />
    <div>
      <slot />
    </div>
  </BaseTop>
</template>

<script setup lang="ts">
import type { IAccountClosureFilter } from '@/models/modules/report/account-closure/Filter.model'
import type { TBaseOption } from '@/models/Global.model'
import { ReceiptTypeEnum } from '@/enums/modules/finance/receipt/ReceiptType.enum'
import { AssetTypeItems } from '@/enums/modules/asset/AssetType.enum'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import Spacer from '@/components/flex/Spacer.vue'
import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const receiptTypeOptions: TBaseOption[] = [
  { label: 'ปิดบัญชี', value: ReceiptTypeEnum.CLOSE_CONTRACT },
  { label: 'รีไฟแนนซ์', value: ReceiptTypeEnum.REFINANCE }
]

const assetTypeOptions: TBaseOption[] = AssetTypeItems

const model = defineModel<string>({ default: '' })
const filters = defineModel<IAccountClosureFilter>('filters', {
  default: (): IAccountClosureFilter => ({})
})

function onSearch (): void {
  emits('search')
}

function onModalSearch (close: () => void): void {
  emits('search')
  emits('modalSearch')
  close()
}

function onClear (close: () => void): void {
  emits('clear')
  close()
}
</script>

<style scoped></style>
