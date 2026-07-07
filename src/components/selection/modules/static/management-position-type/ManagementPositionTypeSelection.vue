<template>
  <div class="relative">
    <BaseStaticSelection
      v-bind="attrs"
      v-model="modelValue"
      v-model:selected-name="selectedNameValue"
      :fetch-options="fetchOptions"
      :invalid="isInvalid"
      :map-option-to-model="mapOptionToModel"
      option-label="name" />
    <Transition name="error-float">
      <div
        v-if="isInvalid && errorMessage"
        class="error-float">
        {{ errorMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { TBaseModel, TBaseOption } from '@/models/Global.model'
import { ManagementPositionItems, type TManagementPosition } from '@/enums/modules/management-structure/ManagementPosition.enum'
import BaseStaticSelection from '@/components/selection/modules/static/BaseStaticSelection.vue'

interface IFormState {
  [key: string]: {
    invalid?: boolean
    error?: { message?: string }
    errors?: Array<{ message?: string }>
  }
}

interface IProps {
  invalid?: boolean
  form?: IFormState
}

const props = withDefaults(defineProps<IProps>(), {
  invalid: undefined,
  form: undefined
})

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const modelValue = defineModel<TManagementPosition>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const isInvalid = computed((): boolean => {
  if (props.invalid !== undefined) return props.invalid
  if (!props.form || !attrs.name) return false
  return props.form[attrs.name as string]?.invalid ?? false
})

const errorMessage = computed((): string => {
  if (!props.form || !attrs.name) return ''
  const fieldState = props.form[attrs.name as string]
  return fieldState?.error?.message ?? fieldState?.errors?.[0]?.message ?? ''
})

const fetchOptions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => (
  (ManagementPositionItems ?? []).map((item: TBaseOption): TBaseModel => ({
    id: item.value!,
    name: item?.label
  }))
)) ?? []

const mapOptionToModel = (item: TBaseModel): TManagementPosition | undefined => item?.id ? item.id as TManagementPosition : undefined
</script>

<style scoped>
.error-float {
  position: absolute;
  top: 100%;
  left: 0;
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  z-index: 50;
}

.error-float-enter-active,
.error-float-leave-active {
  transition: all 0.2s ease;
}

.error-float-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.error-float-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.error-float-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.error-float-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
