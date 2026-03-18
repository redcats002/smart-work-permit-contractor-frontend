<template>
  <AutoCompleteInput
    v-model="innerModel"
    :invalid="props.invalid"
    :multiple="props.multiple"
    :suggestions="suggestions"
    class="h-9!"
    option-label="name"
    complete-on-focus
    force-selection
    @complete="search()" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel } from '@/models/Global.model'
import type { IBranchList } from '@/models/response/branch/BranchRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { IBranchProvider } from '@/resources/provider/branch/Branch.provider'
import BranchProvider from '@/resources/provider/branch/Branch.provider'
import AutoCompleteInput from '@/components/input/AutoCompleteInput.vue'
import usePagination from '@/composables/usePagination'

interface IProps {
  invalid?: boolean
  multiple?: boolean
}

const props = defineProps<IProps>()

const BranchService: IBranchProvider = new BranchProvider()

const model = defineModel<TBaseParamsId | TBaseParamsId[] | null>()
const selectedName = defineModel<string | null>('selectedName', { default: null })

const innerModel = ref<TBaseModel | TBaseModel[] | null>(props.multiple ? [] : null)

const { pagination } = usePagination()

const suggestions = ref<TBaseModel[]>([])

async function useFetch (): Promise<void> {
  const response = await BranchService.getBranchPaginate({
    page: pagination.value.page,
    limit: 9999
  })

  suggestions.value = (response.data ?? [])
    .filter((item: IBranchList): boolean => item.id !== undefined && item.name !== undefined)
    .map((item: IBranchList): TBaseModel => ({
      id: item.id ?? null,
      name: item.name ?? ''
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
  if (props.multiple) {
    const ids = Array.isArray(model.value) ? model.value.map((id: TBaseParamsId): string => String(id)) : []
    innerModel.value = ids.length > 0
      ? suggestions.value.filter((i: TBaseModel): boolean => ids.includes(String(i.id)))
      : []
    return
  }
  if (model.value == null || Array.isArray(model.value)) {
    innerModel.value = null
    selectedName.value = null
    return
  }
  innerModel.value = suggestions.value.find((i: TBaseModel): boolean => i.id === model.value) ?? null
  selectedName.value = (innerModel.value as TBaseModel | null)?.name ?? null
}

watch(innerModel, (val: TBaseModel | TBaseModel[] | null): void => {
  if (props.multiple) {
    return
  }
  const item = val as TBaseModel | null
  model.value = item?.id ? Number(item.id) : null
  selectedName.value = item?.name ?? null
})

watch(model, (): void => {
  syncInnerFromId()
})

watch(
  suggestions, (): void => {
    syncInnerFromId()
  }, { immediate: true }
)

onMounted((): void => {
  fetch()
})
</script>

<style scoped></style>
