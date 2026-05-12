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
    :refresh-deps="refreshDeps"
    option-label="name" />
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { ILocationList } from '@/models/response/warehouse/WarehouseRes.model'
import WarehouseProvider, { type IWarehouseProvider } from '@/resources/provider/warehouse/Warehouse.provider'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'
import usePagination from '@/composables/usePagination'

interface IProps {
  warehouseId?: number | null
  name?: string
  invalid?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  warehouseId: null,
  name: undefined,
  invalid: false
})
const attrs = useAttrs()
const WarehouseService: IWarehouseProvider = new WarehouseProvider()

const modelValue = defineModel<number | null>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const refreshDeps = computed((): (number | null)[] => [props.warehouseId])

const { pagination } = usePagination()

const fetchSuggestions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const response = await WarehouseService.getLocationPaginate({
    page: pagination.value.page,
    limit: 9999,
    warehouseId: props.warehouseId ?? undefined
  })

  return (response.data ?? []).map((item: ILocationList): TBaseModel => ({
    id: item.id ?? null,
    name: item.name
  }))
}) ?? []

const mapOptionToModel = (item: TBaseModel): number | null => item?.id != null ? Number(item.id) : null
</script>

<style scoped></style>
