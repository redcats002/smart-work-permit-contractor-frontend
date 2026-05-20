<template>
  <DatePicker
    v-model="pickerValue"
    :date-format="dateFormat"
    :icon-position="iconPosition"
    :manual-input="false"
    v-bind="attrs"
    class="w-full h-9 text-sm!"
    icon-display="input"
    update-model-type="date"
    fluid
    show-icon />
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false
})

const model = defineModel<Date | Date[] | string | string[] | null>()
const startModel = defineModel<Date | string | null | undefined>('start')
const endModel = defineModel<Date | string | null | undefined>('end')
withDefaults(defineProps<{ dateFormat?: string, iconPosition?: 'prepend' | 'append' }>(), {
  dateFormat: 'dd/mm/yy',
  iconPosition: 'append'
})

const attrs = useAttrs()
const instance = getCurrentInstance()
const useStartEndRange = computed((): boolean => {
  return 'start' in (instance?.vnode?.props ?? {})
})


function parseDate (value: string | Date | null | undefined): Date | null {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const pickerValue = computed<Date | Date[] | null>({
  get (): Date | Date[] | null {
    if (useStartEndRange.value) {
      const startDate = parseDate(startModel.value)
      const endDate = parseDate(endModel.value)
      const parsed = [startDate, endDate].filter((item: Date | null): item is Date => item !== null)
      return parsed.length > 0 ? parsed : null
    }

    const value = model.value
    if (Array.isArray(value)) {
      const parsed = value.map((item: string | Date | null | undefined): Date | null => parseDate(item))
      const filtered = parsed.filter((item: Date | null): item is Date => item !== null)
      return filtered.length > 0 ? filtered : null
    }
    return parseDate(value as string | Date | null)
  },
  set (value: Date | Date[] | string | string[] | null): void {
    if (useStartEndRange.value) {
      if (Array.isArray(value)) {
        const [startDate, endDate] = value
        startModel.value = parseDate(startDate as string | Date | null | undefined)
        endModel.value = parseDate(endDate as string | Date | null | undefined)
        return
      }

      startModel.value = parseDate(value as string | Date | null)
      endModel.value = null
      return
    }

    if (Array.isArray(value)) {
      model.value = value as Date[]
      return
    }
    model.value = parseDate(value as string | Date | null)
  }
})

</script>

<style scoped>

</style>
