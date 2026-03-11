<template>
  <div>
    <div
      v-for="(_, i) in model.branchTimes"
      :key="`model-option-${i}`"
      class="grid grid-cols-1 md:flex md:items-end gap-5 mb-4">
      <LabelField
        :form="form"
        :label="i===0 ? `วันทำการ` :undefined"
        :name="`branchTimes.${i}.day`"
        :required="i===0"
        class="w-fit"
        hide-error>
        <Weekday
          v-model="(model.branchTimes[i].day as TDays[])"
          :name="`branchTimes.${i}.day`"
          :not-allow-days="notAllowDays"
          class="w-max" />
      </LabelField>
      <LabelField
        :form="form"
        :label="i===0 ? `เวลาทำการ` :undefined"
        :name="`branchTimes.${i}.openTime`"
        :required="i===0"
        class="w-full md:grow"
        hide-error>
        <TimePickerInput
          v-model:end="model.branchTimes[i].closeTime"
          v-model:start="model.branchTimes[i].openTime"
          :name="`branchTimes.${i}.openTime`"
          range />
      </LabelField>
      <Button
        class="w-14"
        rounded
        text
        @click="onRemove(i)">
        <Icon
          icon="material-symbols:delete-outline" />
      </Button>
    </div>
    <CreateButton
      class="mt-4"
      label="วัน/เวลา ทำการ"
      @click="onAdd()" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IFormState } from '@/models/Form.model'
import type { TDays } from '@/enums/Date.enum'
import CreateButton from '@/components/button/CreateButton.vue'
import LabelField from '@/components/input/LabelField.vue'
import TimePickerInput from '@/components/input/TimePickerInput.vue'
import Weekday from '@/components/input/Weekday.vue'
import { Icon } from '@iconify/vue'
import { type BranchFormValues, useFormInitialValues } from '../schema/branch.schema'

interface IProps {
  form?: IFormState
}

defineProps<IProps>()

const model = defineModel<BranchFormValues>({
  default: useFormInitialValues()
})

const notAllowDays = computed((): TDays[] => {
  const days: TDays[] = []
  model.value.branchTimes.forEach((branchTime: BranchFormValues['branchTimes'][number]): void => {
    branchTime.day.forEach((day: TDays): void => {
      if (days.includes(day)) return
      days.push(day)
    })
  })
  return days
})

function onAdd (): void {
  model.value.branchTimes.push({
    closeTime: '',
    openTime: '',
    day: []
  })
}

function onRemove (index: number): void {
  model.value.branchTimes.splice(index, 1)
}

</script>

<style scoped>

</style>
