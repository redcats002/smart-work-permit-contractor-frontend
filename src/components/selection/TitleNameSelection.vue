<template>
  <SelectInput
    v-model="innerModel"
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
import { TitleNameItems, type TTitleName } from '@/enums/TitleName.enum'
import SelectInput from '@/components/input/SelectInput.vue'
import usePagination from '@/composables/usePagination'

const model = defineModel<TTitleName>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<TBaseModel | null>(null)

const { pagination } = usePagination()

const options = ref<TBaseModel[]>([])

async function useFetch (): Promise<void> {
  const items = TitleNameItems

  options.value = (items ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item?.value || -1,
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
  model.value = val?.id ? val.id as TTitleName : undefined
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
