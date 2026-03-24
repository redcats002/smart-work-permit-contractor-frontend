<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="(item, i) in items"
      :key="`${item}-${i}`"
      :aria-pressed="isSelected(item)"
      :class="[
        'cursor-pointer w-10 h-10 rounded-full border border-primary text-sm font-semibold flex items-center justify-center transition-colors duration-200',
        isSelected(item)
          ? 'bg-primary text-white'
          : 'bg-white text-primary',
        props.readonly ? 'pointer-events-none' : ''
      ]"
      type="button"
      @click="onClickToggle(item)">
      {{ formatDayToThai(item, true) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EDays, formatDayToThai, type TDays } from '@/enums/Date.enum'

interface IProps {
  notAllowDays?: TDays[]
  readonly?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  notAllowDays: (): TDays[] => [],
  readonly: false
})

const items = ref<EDays[]>([
  EDays.SUNDAY,
  EDays.MONDAY,
  EDays.TUESDAY,
  EDays.WEDNESDAY,
  EDays.THURSDAY,
  EDays.FRIDAY,
  EDays.SATURDAY
])

const model = defineModel<TDays[]>()

function isSelected (day: TDays): boolean {
  return (model.value || []).includes(day)
}

function isNotAllow (day: string | TDays): boolean {
  // if (props.notAllowDays.length === 1) return false
  const index = props.notAllowDays.findIndex((_day: TDays): boolean => _day === day)
  return index !== -1
}

function onClickToggle (day: TDays): void {
  if (props.readonly) return
  if (isNotAllow(day)) {
    const index = model.value?.findIndex((_day: TDays): boolean => {
      return _day === day
    }) ?? -1
    const temp = index
    if (temp < 0) return
    model.value?.splice(index, 1)
    return
  }

  const current = [...(model.value || [])]
  const index = current.findIndex((item: TDays): boolean => item === day)

  if (index !== -1) {
    current.splice(index, 1)
  } else {
    current.push(day)
  }

  model.value = current
}
</script>
