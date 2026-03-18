<template>
  <AutoCompleteInput
    v-model="innerModel"
    :suggestions="suggestions"
    option-label="name"
    complete-on-focus
    force-selection
    @complete="search()" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { ILocationList } from '@/models/response/warehouse/WarehouseRes.model'
import WarehouseProvider, { type IWarehouseProvider } from '@/resources/provider/warehouse/Warehouse.provider'
import AutoCompleteInput from '@/components/input/AutoCompleteInput.vue'
import usePagination from '@/composables/usePagination'

const WarehouseService: IWarehouseProvider = new WarehouseProvider()

interface IProps {
  warehouseId?: number | null
}

const props = defineProps<IProps>()

const model = defineModel<number | null>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<TBaseModel | null>(null)
const { pagination } = usePagination()
const suggestions = ref<TBaseModel[]>([])

async function useFetch (): Promise<void> {
  const response = await WarehouseService.getLocationPaginate({
    page: pagination.value.page,
    limit: 9999,
    warehouseId: props.warehouseId ?? undefined
  })
  suggestions.value = (response.data ?? []).map((item: ILocationList): TBaseModel => ({
    id: item.id ?? null,
    name: item.name
  }))
}

function fetch (): void {
  handleLoading(useFetch)
}

function search (): void {
  pagination.value.page = 1
  fetch()
}

function syncInnerFromId (): void {
  if (model.value == null) {
    innerModel.value = null
    selectedName.value = null
    return
  }
  innerModel.value = suggestions.value.find((i: TBaseModel): boolean => i.id === model.value) ?? null
  selectedName.value = innerModel.value?.name ?? null
}

watch(innerModel, (val: TBaseModel | null): void => {
  model.value = val?.id ? Number(val.id) : null
  selectedName.value = val?.name ?? null
})
watch(model, (): void => {
  syncInnerFromId()
})
watch(suggestions, (): void => {
  syncInnerFromId()
}, { immediate: true })
watch((): number | null | undefined => props.warehouseId, (): void => {
  model.value = null
  innerModel.value = null
  selectedName.value = null
  suggestions.value = []
  fetch()
})

onMounted((): void => {
  fetch()
})
</script>
