<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :empty-model-value="''"
    :fetch-options="fetchOptions"
    :is-empty-model-value="isEmptyModelValue"
    :map-option-to-model="mapOptionToModel"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { AssetsStatusItems, AssetStatusForCancelledContractItems, AssetStatusForCloseContractContractItems } from '@/enums/modules/asset/AssetStatus.enum'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

interface IProps {
  optionAll?: boolean
  contractStatus?: TContractStatus
}

const props = withDefaults(defineProps<IProps>(), {
  optionAll: false,
  contractStatus: undefined
})
const attrs = useAttrs()

const modelValue = defineModel<string>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const items: TBaseOption[] = getStatusItemsByContractStatus()
  const options = items.map(
    (item: TBaseOption): TBaseModel => ({
      id: item.value!,
      name: item.label
    })
  )

  if (props.optionAll) {
    options.unshift({ id: null, name: 'ทั้งหมด' })
  }
  return options
}) ?? []

const mapOptionToModel = (item: TBaseModel): string => String(item?.id ?? '')
const isEmptyModelValue = (value: string | null | undefined): boolean => !value

function getStatusItemsByContractStatus (): TBaseOption[] {
  if (props.contractStatus === 'CLOSE_CONTRACT') return AssetStatusForCloseContractContractItems
  if (props.contractStatus === 'CANCELLED') return AssetStatusForCancelledContractItems
  return AssetsStatusItems
}
</script>

<style scoped></style>
