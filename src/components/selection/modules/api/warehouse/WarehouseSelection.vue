<template>
  <BaseSelection
    v-bind="{
      ...props,
      ...attrs
    }"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :fetch-suggestions="fetchSuggestions"
    :map-option-to-model="mapOptionToModel"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { IGetWarehouseList } from '@/models/request/warehouse/WarehouseReq.model'
import type { IWarehouseList } from '@/models/response/warehouse/WarehouseRes.model'
import WarehouseProvider, { type IWarehouseProvider } from '@/resources/provider/warehouse/Warehouse.provider'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'
import usePagination from '@/composables/usePagination'

interface IProps {
  query?: IGetWarehouseList
  invalid?: boolean
  disabledIds?: number[]
  showClear?: boolean
}

const props = defineProps<IProps>()
const attrs = useAttrs()
const WarehouseService: IWarehouseProvider = new WarehouseProvider()

const modelValue = defineModel<number | null>({ required: false })
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const { pagination } = usePagination({ inheritQuery: false })

const fetchSuggestions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const response = await WarehouseService.getWarehousePaginate({
    ...props.query,
    page: pagination.value.page,
    limit: 9999
  })

  return (response.data ?? []).map((item: IWarehouseList): TBaseModel => ({
    id: item.id!,
    name: item.name,
    disabled: props.disabledIds?.includes(Number(item?.id)) ?? false
  }))
}) ?? []

const mapOptionToModel = (item: TBaseModel): number | null => item?.id != null ? Number(item.id) : null
</script>

<style scoped></style>
