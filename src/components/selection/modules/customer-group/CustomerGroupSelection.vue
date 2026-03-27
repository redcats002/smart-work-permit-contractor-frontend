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
import type { ICustomerGroupList } from '@/models/response/customer-group/CustomerGroupRes.model'
import type { ICustomerGroupProvider } from '@/resources/provider/customer-group/CustomerGroup.provider'
import CustomerGroupProvider from '@/resources/provider/customer-group/CustomerGroup.provider'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'
import usePagination from '@/composables/usePagination'

const attrs = useAttrs()
const CustomerGroupService: ICustomerGroupProvider = new CustomerGroupProvider()

const modelValue = defineModel<number | null>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const { pagination } = usePagination()

const fetchSuggestions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const response = await CustomerGroupService.getCustomerGroupPaginate({
    page: pagination.value.page,
    limit: 9999
  })

  return (response.data ?? []).map((item: ICustomerGroupList): TBaseModel => ({
    id: item.id ?? null,
    name: item.name ?? ''
  }))
}) ?? []

const mapOptionToModel = (item: TBaseModel): number | null => item?.id != null ? Number(item.id) : null
</script>

<style scoped></style>
