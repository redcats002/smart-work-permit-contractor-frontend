<template>
  <BaseStaticSelection
    v-bind="attrs"
    v-model="modelValue"
    v-model:selected-name="selectedNameValue"
    :fetch-options="fetchOptions"
    :map-option-to-model="mapOptionToModel"
    option-label="name"
    placeholder="คำนำหน้า" />
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { TitleNameItems, type TTitleName } from '@/enums/TitleName.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

const attrs = useAttrs()

const modelValue = defineModel<TTitleName>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => (
  (TitleNameItems ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item?.value || -1,
    name: item?.label
  }))
)) ?? []

const mapOptionToModel = (item: TBaseModel): TTitleName | undefined => item?.id ? item.id as TTitleName : undefined
</script>

<style scoped></style>
