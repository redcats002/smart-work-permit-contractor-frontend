<template>
  <BaseSelection
    v-bind="attrs"
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
import type { IHowDidFindUsList } from '@/models/response/how-did-find-us/HowDidFindUsRes.model'
import HowDidFindUsProvider, { type IHowDidFindUsProvider } from '@/resources/provider/how-did-find-us/HowDidFindUs.provider'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'
import usePagination from '@/composables/usePagination'

const attrs = useAttrs()
const HowDidFindUsService: IHowDidFindUsProvider = new HowDidFindUsProvider()

const modelValue = defineModel<number | null>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const { pagination } = usePagination({ inheritQuery: false })

const fetchSuggestions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const response = await HowDidFindUsService.getHowDidFindUsPaginate({
    page: pagination.value.page,
    limit: 9999
  })

  return (response.data ?? []).map((item: IHowDidFindUsList): TBaseModel => ({
    id: item.id!,
    name: item.name
  }))
}) ?? []

const mapOptionToModel = (item: TBaseModel): number | null => item?.id != null ? Number(item.id) : null
</script>

<style scoped></style>
