<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :empty-model-value="''"
    :fetch-options="fetchOptions"
    :is-empty-model-value="isEmptyModelValue"
    :map-option-to-model="mapOptionToModel"
    :refresh-deps="[category]"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { AssetTypeItems, LandAssetTypeItems, VehicleAssetTypeItems } from '@/enums/modules/asset/AssetType.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'
import type { TAssetCategory } from '@/pages/contract/pages/create/schema/pre-contract.schema'

interface IProps {
  optionAll?: boolean
  category?: TAssetCategory
}

const props = withDefaults(defineProps<IProps>(), {
  category: null
})
const attrs = useAttrs()

const modelValue = defineModel<string>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

function itemsForCategory (): TBaseOption[] {
  if (props.category === 'VEHICLE') return VehicleAssetTypeItems
  if (props.category === 'LAND') return LandAssetTypeItems
  return AssetTypeItems
}

const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const options = itemsForCategory().map(
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
</script>

<style scoped></style>
