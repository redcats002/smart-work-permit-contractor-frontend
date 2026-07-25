<template>
  <div class="relative inline-flex p-fluid:flex w-full">
    <AutoComplete
      ref="autoCompleteRef"
      v-bind="attrs"
      v-model="model"
      :autocomplete="autocomplete"
      :class="attrs?.multiple ? 'min-h-9 shadow-none!' : 'h-9 shadow-none!'"
      :dropdown="dropdown"
      :name="name"
      :placeholder="placeholder"
      class="w-full"
      dropdown-class="bg-white"
      fluid
      @blur="setEditing(false)"
      @focus="setEditing(true)">
      <template #dropdownicon>
        <Icon
          class="size-5 text-surface-400"
          icon="mdi:chevron-down" />
      </template>
      <template #clearicon="{ clearCallback }">
        <div :class="clearIconClass">
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
      <template #empty>
        ไม่พบข้อมูล
      </template>
    </AutoComplete>
    <!-- Covers only the text input area (not the dropdown button) to show correct label -->
    <div
      v-if="displayLabel && !editing && !attrs.multiple"
      :class="[
        attrs.invalid ? 'border-red-400! dark:border-red-300!' : '',
        attrs.disabled ? 'cursor-not-allowed opacity-0' : 'cursor-pointer'
      ]"
      class="absolute inset-y-0 left-0 right-10 flex items-center px-3
             bg-surface-0 dark:bg-surface-950 text-surface-700 dark:text-surface-0
             border border-r-0 border-surface-300 dark:border-surface-700 rounded-s-sm
             text-sm overflow-hidden"
      @click="startEditing()">
      {{ displayLabel }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs } from 'vue'
import type { TBaseModel } from '@/models/Global.model'
import AutoComplete from '@/volt/AutoComplete.vue'
import { Icon } from '@iconify/vue'

defineOptions({ inheritAttrs: false })

interface IProps {
  name?: string
  dropdown?: boolean
  placeholder?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<IProps>(), {
  name: '',
  dropdown: true,
  placeholder: '',
  autocomplete: 'off'
})

const attrs = useAttrs()
const model = defineModel<TBaseModel | TBaseModel[] | null>()
const autoCompleteRef = ref<InstanceType<typeof AutoComplete> | null>(null)
const editing = ref(false)

const optionLabel = computed((): string => String(attrs?.['option-label'] ?? attrs?.optionLabel ?? 'name'))

const displayLabel = computed((): string => {
  if (!model.value || Array.isArray(model.value) || typeof model.value !== 'object') return ''
  return String((model.value as any)?.[optionLabel.value] ?? '')
})

function setEditing (value: boolean): void {
  editing.value = value
}

async function startEditing (): Promise<void> {
  if (attrs.disabled) return
  editing.value = true
  await nextTick()
  const el = (autoCompleteRef.value as any)?.$el?.querySelector('input')
  el?.focus()
}

const clearIconClass = computed((): string => `flex h-full shrink-0 items-center justify-center px-2
    border border-x-0 border-surface-300 dark:border-surface-700
    bg-surface-0 dark:bg-surface-950
    transition-colors duration-200
    group-focus-within:border-primary
    group-[.p-invalid]:border-red-400! dark:group-[.p-invalid]:border-red-300!
    ${props.dropdown ? '' : 'rounded-e-sm'}`)
</script>

<style scoped></style>
