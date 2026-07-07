<template>
  <div class="relative">
    <BaseSelection
      v-bind="attrs"
      v-model="modelValue"
      v-model:selected-name="selectedNameValue"
      :fetch-suggestions="fetchSuggestions"
      :invalid="isInvalid"
      :map-option-to-model="mapOptionToModel"
      :refresh-deps="refreshDeps"
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
import type { TBaseModel } from '@/models/Global.model'
import type { EManagementPosition } from '@/enums/modules/management-structure/ManagementPosition.enum'
import type { IManagementPositionList } from '@/models/response/management-position/ManagementPositionRes.model'
import ManagementPositionProvider, { type IManagementPositionProvider } from '@/resources/provider/management-position/ManagementPosition.provider'
import BaseSelection from '@/components/selection/modules/BaseSelection.vue'
import usePagination from '@/composables/usePagination'

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
  managementPosition?: EManagementPosition
}

const props = withDefaults(defineProps<IProps>(), {
  invalid: undefined,
  form: undefined,
  managementPosition: undefined
})

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const ManagementPositionService: IManagementPositionProvider = new ManagementPositionProvider()

const modelValue = defineModel<number | null>()
const selectedNameValue = defineModel<string | null>('selectedName', { default: null })

const { pagination } = usePagination({ inheritQuery: false })

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

const refreshDeps = computed((): unknown[] => [props.managementPosition])

const fetchSuggestions = async (): Promise<TBaseModel[]> => await handleLoading(async (): Promise<TBaseModel[]> => {
  if (!props.managementPosition) return []

  const response = await ManagementPositionService.getManagementPositionPaginate({
    page: pagination.value.page,
    limit: 9999,
    managementPosition: props.managementPosition
  })

  return (response.data ?? []).map((item: IManagementPositionList): TBaseModel => ({
    id: item.id ?? null,
    name: item.name
  }))
}) ?? []

const mapOptionToModel = (item: TBaseModel): number | null => item?.id != null ? Number(item.id) : null
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
