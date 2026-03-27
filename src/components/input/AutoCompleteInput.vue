<template>
  <AutoComplete
    v-bind="$attrs"
    v-model="model"
    :autocomplete="autocomplete"
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
    <!-- !DEPRECATED better use MultiSelectInput -->
    <template
      v-if="$attrs?.multiple"
      #option="{ option }">
      <div
        class="flex gap-1.5 items-center w-full">
        <CheckboxInput
          :model-value="isSelected(option)"
          class="pointer-events-none"
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
import type { TBaseModel } from '@/models/Global.model'
import AutoComplete from '@/volt/AutoComplete.vue'
import { Icon } from '@iconify/vue'
import CheckboxInput from './CheckboxInput.vue'

interface IProps {
  name?: string
  dropdown?: boolean
  placeholder?: string
  autocomplete?: string
}

withDefaults(defineProps<IProps>(), {
  name: '',
  dropdown: true,
  placeholder: '',
  autocomplete: 'off'
})

const model = defineModel<TBaseModel | TBaseModel[] | null>()

function isSelected (option: TBaseModel): boolean {
  if (Array.isArray(model.value)) return model.value.some((item: TBaseModel): boolean => item?.id === option.id)
  return model.value?.id === option?.id
}
</script>

<style scoped></style>
