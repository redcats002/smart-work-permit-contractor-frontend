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
import SelectInput from '@/components/input/SelectInput.vue'
import usePagination from '@/composables/usePagination'
import { AssetsStatusItems } from '@/enums/modules/asset/AssetStatus.enum'

interface IProps {
  optionAll?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
})

const model = defineModel<string>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<TBaseModel | null>(null)

const { pagination } = usePagination()

const options = ref<TBaseModel[]>([])

function itemsForCategory (): TBaseOption[] {
  return AssetsStatusItems
}

async function useFetch (): Promise<void> {
  options.value = itemsForCategory().map(
    (item: TBaseOption): TBaseModel => ({
      id: item.value!,
      name: item.label
    })
  )
  if (props.optionAll) {
    options.value.unshift({ id: null, name: 'ทั้งหมด' })
  }
}

function fetch (): void {
  handleLoading(useFetch)
}

function search (): void {
  pagination.value.page = 1
  fetch()
}

function syncInnerFromId (): void {
  if (!model.value) {
    innerModel.value = null
    selectedName.value = null
    return
  }

  innerModel.value = options.value.find((i: TBaseModel): boolean => i.id === model.value) ?? null
  selectedName.value = innerModel.value?.name ?? null
}

watch(innerModel, (val: TBaseModel | null): void => {
  if (!val) {
    model.value = undefined
    selectedName.value = null
    return
  }

  if (typeof val === 'string') {
    model.value = val
    selectedName.value = options.value.find((i: TBaseModel): boolean => i.id === val)?.name ?? null
    return
  }

  model.value = (val.id || '') as string
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
