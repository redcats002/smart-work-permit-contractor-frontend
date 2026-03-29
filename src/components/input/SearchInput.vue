<template>
  <div class="flex items-stretch relative w-full flex-auto md:w-75 md:flex-none">
    <Icon
      class="size-5 absolute top-1/2 rounded-sm! -translate-y-1/2 text-surface-400 inset-s-3 pointer-events-none"
      icon="system-uicons:search" />
    <InputText
      v-model="model"
      class="h-9"
      placeholder="ค้นหา"
      pt:root="flex-1 rounded-s-sm w-full rounded-none pl-11 border-0 border-b border-gray-400! bg-transparent"
      variant="outlined"
      @keypress.enter="onEnterSearch()"
      @update:model-value="debounceSearch()" />
    <!-- <div class="flex items-center justify-center border-y border-e h-9! border-surface-300 dark:border-surface-700 rounded-e-sm overflow-hidden">
      <SecondaryButton
        pt:root="rounded-none bg-[#62748E]!"
        variant="text"
        @click="emitSearch()">
        <Icon
          class="size-5 text-white"
          icon="system-uicons:search" />
      </SecondaryButton>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebounce } from '@/utils/Debounce'
import { Icon } from '@iconify/vue'

interface IEmits {
  search: [searchValue: string]
}

const model = defineModel<string>({ default: '' })
const emits = defineEmits<IEmits>()

const route = useRoute()
const router = useRouter()

function emitSearch (): void {
  router.replace({
    query: {
      ...route.query,
      search: model.value
    }
  })
  emits('search', model.value)
}

const debounceSearch = useDebounce(emitSearch)

function onEnterSearch (): void {
  debounceSearch.cancel()
  emitSearch()
}

onMounted((): void => {
  model.value = route.query?.search as string || ''
})
</script>
