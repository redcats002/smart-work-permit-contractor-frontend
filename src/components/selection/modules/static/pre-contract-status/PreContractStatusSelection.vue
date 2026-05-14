<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :empty-model-value="''"
    :fetch-options="fetchOptions"
    :is-empty-model-value="isEmptyModelValue"
    :map-option-to-model="mapOptionToModel"
    option-label="name" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { PreContractStatusEnum, PreContractStatusItems, type TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

interface IProps {
  optionAll?: boolean
}

const props = withDefaults(defineProps<IProps>(), {})
const attrs = useAttrs()

const modelValue = defineModel<TPreContractStatus | ''>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const fetchOptions = async (): Promise<TBaseModel[]> =>
  (await handleLoading(async (): Promise<TBaseModel[]> => {
    const options = PreContractStatusItems.filter((item: TBaseOption): boolean => item?.value !== PreContractStatusEnum.DONE).map(
      (item: TBaseOption): TBaseModel => ({
        id: item.value!,
        name: item.label
      })
    )

    if (props.optionAll) {
      options.unshift({ id: null, name: 'ทั้งหมด' })
    }
    return options
  })) ?? []

const mapOptionToModel = (item: TBaseModel): TPreContractStatus | '' => String(item?.id ?? '') as TPreContractStatus | ''
const isEmptyModelValue = (value: TPreContractStatus | '' | null | undefined): boolean => !value
</script>

<style scoped></style>
