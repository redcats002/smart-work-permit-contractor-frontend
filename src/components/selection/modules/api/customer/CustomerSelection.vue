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
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { ICustomerList } from '@/models/response/customer/CustomerRes.model'
import type { ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import CustomerProvider from '@/resources/provider/customer/Customer.provider'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'
import usePagination from '@/composables/usePagination'

interface IProps {
  invalid?: boolean
  disabledIds?: number[]
  showClear?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  disabledIds: (): number[] => [],
  showClear: false,
  invalid: false
})

const attrs = useAttrs()
const CustomerService: ICustomerProvider = new CustomerProvider()

const modelValue = defineModel<number | null>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const { pagination } = usePagination({ inheritQuery: false })

const fetchSuggestions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  const response = await CustomerService.getCustomerPaginate({
    page: pagination.value.page,
    limit: 9999
  })

  return (response.data ?? []).map((item: ICustomerList): TBaseModel => ({
    id: item.id!,
    name: formatter.fullName(item),
    disabled: props.disabledIds?.includes(Number(item?.id)) ?? false
  }))
}) ?? []

const mapOptionToModel = (item: TBaseModel): number | null => item?.id != null ? Number(item.id) : null
</script>

<style scoped></style>
