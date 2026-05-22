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
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { IEmployeeList } from '@/models/response/employee/EmployeeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IEmployeeProvider } from '@/resources/provider/employee/Employee.provider'
import EmployeeProvider from '@/resources/provider/employee/Employee.provider'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'
import usePagination from '@/composables/usePagination'

const attrs = useAttrs()
const EmployeeService: IEmployeeProvider = new EmployeeProvider()

const modelValue = defineModel<TBaseParamsId | null>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const { pagination } = usePagination({ inheritQuery: false })

const fetchSuggestions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const response = await EmployeeService.getEmployeePaginate({
    page: pagination.value.page,
    limit: 9999
  })

  return (response.data ?? []).map((item: IEmployeeList): TBaseModel => ({
    id: item.id!,
    name: formatter.fullName(item)
  }))
}) ?? []

const mapOptionToModel = (item: TBaseModel): TBaseParamsId | null => item?.id != null ? String(item.id) : null
</script>

<style scoped></style>
