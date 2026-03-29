<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :fetch-options="fetchOptions"
    :invalid="props.invalid"
    :map-option-to-model="mapOptionToModel"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { type TWarehouseStatus, WarehouseStatusItems } from '@/enums/modules/warehouse/WarehouseStatus.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

interface IProps {
  invalid?: boolean
}

const props = defineProps<IProps>()
const attrs = useAttrs()

const modelValue = defineModel<TWarehouseStatus>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => (
  (WarehouseStatusItems ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item?.label
  }))
)) ?? []

const mapOptionToModel = (item: TBaseModel): TWarehouseStatus | undefined => item?.id ? item.id as TWarehouseStatus : undefined
</script>

<style scoped></style>
