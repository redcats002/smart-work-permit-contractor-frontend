<template>
  <BaseSelection
    v-bind="{
      ...props,
      ...attrs
    }"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :fetch-suggestions="fetchSuggestions"
    :invalid="invalid"
    :multiple="multiple"
    :option-label="'name'"
    :placeholder="placeholder" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import type { TBaseModel } from '@/models/Global.model'
import type { IBranchList } from '@/models/response/branch/BranchRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IBranchProvider } from '@/resources/provider/branch/Branch.provider'
import BranchProvider from '@/resources/provider/branch/Branch.provider'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'
import usePagination from '@/composables/usePagination'

interface IProps {
  invalid?: boolean
  multiple?: boolean
  placeholder?: string
}

const props = defineProps<IProps>()
const attrs = useAttrs()

const modelValue = defineModel<TBaseParamsId | TBaseParamsId[] | null>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const BranchService: IBranchProvider = new BranchProvider()
const { pagination } = usePagination({ inheritQuery: false })

const fetchSuggestions = async (): Promise<TBaseModel[]> => {
  const response = await BranchService.getBranchPaginate({
    page: pagination.value.page,
    limit: 9999
  })
  return (response.data ?? [])
    .filter((item: IBranchList): boolean => item.id !== undefined && item.name !== undefined)
    .map((item: IBranchList): TBaseModel => ({
      id: item.id ?? null,
      name: item.name ?? ''
    }))
}
</script>

<style scoped></style>
