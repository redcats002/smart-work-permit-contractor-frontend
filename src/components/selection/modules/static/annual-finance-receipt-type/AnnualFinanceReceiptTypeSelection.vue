<template>
  <SelectInput
    v-model="innerModel"
    :invalid="invalid"
    :options="options"
    option-label="name"
    complete-on-focus
    force-selection
    @complete="search()" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { AnnualFinanceReceiptTypeItems, type TAnnualFinanceReceiptType } from '@/enums/modules/report/annual-finance-receipt/AnnualFinanceReceipt.enum'
import SelectInput from '@/components/input/SelectInput.vue'
import usePagination from '@/composables/usePagination'

interface IProps {
  invalid?: boolean
}

defineProps<IProps>()
const model = defineModel<TAnnualFinanceReceiptType>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<TBaseModel | null>(null)

const { pagination } = usePagination()

const options = ref<TBaseModel[]>([])

async function useFetch (): Promise<void> {
  const items = AnnualFinanceReceiptTypeItems

  options.value = (items ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item?.label
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

  innerModel.value
    = options.value.find((i: TBaseModel): boolean => i.id === model.value) ?? null
  selectedName.value = innerModel.value?.name ?? null
}

watch(innerModel, (val: TBaseModel | null): void => {
  model.value = val?.id ? val.id as TAnnualFinanceReceiptType : undefined
  selectedName.value = val?.name ?? null
})

watch(model, (): void => {
  syncInnerFromId()
})

watch(
  options, (): void => {
    syncInnerFromId()
  }, { immediate: true }
)

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
