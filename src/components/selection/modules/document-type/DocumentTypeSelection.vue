<template>
  <BaseSelection
    v-bind="{
      ...props,
      ...attrs
    }"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :empty-model-value="undefined"
    :fetch-suggestions="fetchSuggestions"
    :map-option-to-model="mapOptionToModel"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { DocumentTypeItems, type TDocumentType } from '@/enums/modules/contract/DocumentType.enum'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'

interface IProps {
  invalid?: boolean
}

const props = defineProps<IProps>()
const attrs = useAttrs()

const modelValue = defineModel<TDocumentType>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const fetchSuggestions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => (
  (DocumentTypeItems ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item?.label
  }))
)) ?? []

const mapOptionToModel = (item: TBaseModel): TDocumentType | undefined => item?.id ? item.id as TDocumentType : undefined
</script>

<style scoped></style>
