<template>
  <div class="relative w-full">
    <label class="block text-sm font-medium text-surface-700">
      {{ label }}
      <span
        v-if="required"
        class="text-(--p-red)"> *</span>
    </label>
    <button
      class="mt-1 flex h-[48px] w-full items-center justify-between rounded-lg border border-(--p-gray-5) bg-white px-5 text-base leading-normal"
      type="button"
      @click="open = !open">
      <span class="mr-3 flex min-h-[28px] w-full flex-wrap items-center gap-2 overflow-y-auto text-surface-900 max-h-[84px]">
        <template v-if="selectedOptions.length">
          <span
            v-for="option in selectedOptions"
            :key="option"
            class="inline-flex items-center gap-1 rounded-full border border-(--p-gray-5) bg-white px-3 py-1 text-sm">
            {{ option }}
            <button
              class="text-surface-500 hover:text-surface-900"
              type="button"
              @click.stop="removeOption(option)">
              ✕
            </button>
          </span>
        </template>
        <span
          v-else
          class="text-surface-500">ทั้งหมด</span>
      </span>
      <svg
        class="h-4 w-4 text-surface-600"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="m19 9-7 7-7-7"
          stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </button>

    <div
      v-if="open"
      class="absolute left-0 z-10 mt-2 w-full max-h-[168px] overflow-y-auto rounded-2xl border border-(--p-gray-5) bg-white p-2 shadow-lg">
      <button
        v-for="option in optionsWithAll"
        :key="option"
        class="flex w-full items-center gap-4 rounded-full px-4 py-2 text-left text-base text-surface-900 hover:bg-gray-50"
        type="button"
        @click="toggleOption(option)">
        <span class="inline-flex h-4 w-4 items-center justify-center rounded-[1px] border-2 border-(--p-red) text-(--p-red)">
          <svg
            v-if="isChecked(option)"
            class="h-3 w-3"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 13l4 4L19 7"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </span>
        <span>{{ option }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  label: string
  options: string[]
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

const open = ref(false)
const selectedOptions = ref<string[]>([])

const optionsWithAll = computed((): string[] => {
  const items: string[] = props.options ?? []
  return items.includes('ทั้งหมด') ? items : ['ทั้งหมด', ...items]
})

const optionItems = computed((): string[] => optionsWithAll.value.filter((item: string): boolean => item !== 'ทั้งหมด'))

const isAllSelected = computed((): boolean => {
  const items = optionItems.value
  return items.length > 0 && items.every((item: string): boolean => selectedOptions.value.includes(item))
})

function isChecked (option: string): boolean {
  if (option === 'ทั้งหมด') return isAllSelected.value
  return selectedOptions.value.includes(option)
}

function toggleOption (option: string): void {
  if (option === 'ทั้งหมด') {
    selectedOptions.value = isAllSelected.value ? [] : [...optionItems.value]
    open.value = false
    return
  }
  if (selectedOptions.value.includes(option)) {
    selectedOptions.value = selectedOptions.value.filter((item: string): boolean => item !== option)
  } else {
    selectedOptions.value = [...selectedOptions.value, option]
  }
  open.value = false
}

function removeOption (option: string): void {
  selectedOptions.value = selectedOptions.value.filter((item: string): boolean => item !== option)
}
</script>
