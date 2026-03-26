<template>
  <AutoComplete
    v-bind="$attrs"
    v-model="model"
    :class="$attrs.multiple ? 'min-h-9 shadow-none!' : 'h-9 shadow-none!'"
    :dropdown="dropdown"
    :name="name"
    :placeholder="placeholder"
    dropdown-class="bg-white"
    fluid>
    <template #clearicon="{ clearCallback }">
      <div class="flex justify-center items-center border-surface-300">
        <Icon
          class="size-5 text-[rgb(164,176,193)] cursor-pointer hover:text-black transition-all duration-200"
          icon="mdi:close"
          @click="clearCallback($event)" />
      </div>
    </template>
    <template #chip="{ value, removeCallback }">
      <span
        v-if="value"
        class="flex items-center gap-1 rounded-md px-2 py-0.5 text-sm text-[#027CE9] bg-[#E7F4FF]">
        <span>
          {{ value?.name || value }}
        </span>
        <Icon
          :stroke-width="2"
          class="size-5 text-[#62748E] cursor-pointer hover:text-black transition-all duration-200"
          icon="mdi:close"
          @click="removeCallback($event)" />
      </span>
    </template>
    <template
      v-if="dropdown"
      #dropdown>
      <div
        :class="dropdownClass"
        :data-p="$attrs?.invalid ? 'invalid' : ''">
        <Icon
          class="size-5"
          icon="mdi:chevron-down" />
      </div>
    </template>
    <!-- <template #dropdownicon>
      <Icon
        class="size-5 text-[#A4B0C1]"
        icon="mdi:chevron-down" />
    </template> -->
    <template
      v-if="$attrs?.multiple"
      #option="{ option }">
      <div
        class="flex gap-1.5 items-center"
        @click="onSelect(option)">
        <CheckboxInput
          :model-value="isSelected(option)"
          readonly />
        {{ option[String($attrs?.optionLabel || 'name')] }}
      </div>
    </template>
    <template #empty>
      ไม่พบข้อมูล
    </template>
  </AutoComplete>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TBaseModel } from '@/models/Global.model'
import AutoComplete from '@/volt/AutoComplete.vue'
import { Icon } from '@iconify/vue'
import CheckboxInput from './CheckboxInput.vue'

interface IProps {
  name?: string
  dropdown?: boolean
  placeholder?: string
}

withDefaults(defineProps<IProps>(), {
  name: undefined,
  dropdown: true,
  placeholder: ''
})

const model = defineModel<TBaseModel | TBaseModel[] | null>()

const dropdownClass = computed((): string => {
  return `cursor-pointer inline-flex items-center justify-center select-none overflow-hidden relative w-10 shrink-0 rounded-e-md
        border border-s-0 border-surface-300 dark:border-surface-700
        group-focus-within:border-primary
				p-invalid:border-red-400 dark:p-invalid:border-red-300
        bg-white dark:bg-surface-800
        text-surface-600 dark:text-surface-300
        transition-colors duration-200`
  // group-hover:border-surface-400 dark:group-hover:border-surface-600
})

function isSelected (option: TBaseModel): boolean {
  if (Array.isArray(model.value)) return model.value.some((item: TBaseModel): boolean => item?.id === option.id)
  return model.value?.id === option?.id
}

function onSelect (value: TBaseModel): void {
  if (!Array.isArray(model.value)) return
  const exists = model.value.some((item: TBaseModel): boolean => item?.id === value?.id)
  if (exists) {
    model.value = model.value.filter((item: TBaseModel): boolean => item?.id !== value?.id).slice()
  } else {
    model.value = [...model.value, value]
  }
}
</script>

<style scoped></style>
