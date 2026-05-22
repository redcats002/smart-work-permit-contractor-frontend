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
import { DocumentStorageMovementStatusItems, type TDocumentStorageMovementStatus } from '@/enums/modules/document-storage/DocumentStorageMovementStatus.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

interface IProps {
  optionAll?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
})
const attrs = useAttrs()

const modelValue = defineModel<TDocumentStorageMovementStatus>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const options = DocumentStorageMovementStatusItems.map(
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
