<template>
  <div class="hidden lg:flex text-sm text-[#333333] items-center gap-2.5">
    <div>จำนวนรายการต่อหน้า</div>
    <div>
      <Select
        v-model="pagination.limit"
        :options="limitOptions"
        class="w-23"
        @update:model-value="onUpdatePagination()" />
    </div>
    <div>จาก {{ pagination.count }}</div>
  </div>

  <div class="hidden lg:flex items-center gap-1">
    <button
      :disabled="currentPage === 1"
      class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-surface-200 text-surface-400 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      @click="goToPage(1)">
      <Icon
        :stroke-width="2"
        class="size-4 text-[#62748E]"
        icon="mdi:chevron-double-left" />
    </button>

    <button
      :disabled="currentPage === 1"
      class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-surface-200 text-surface-400 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      @click="goToPage(currentPage - 1)">
      <Icon
        :stroke-width="2"
        class="size-4 text-[#62748E]"
        icon="mdi:chevron-left" />
    </button>

    <template
      v-for="page in visiblePages"
      :key="page">
      <span
        v-if="page === '...'"
        class="px-2 text-surface-400">
        <Icon
          class="size-4 text-[#62748E]"
          icon="lucide:ellipsis" />
      </span>
      <button
        v-else
        :class="[
          'inline-flex items-center text-[12px] justify-center min-w-7 h-7 px-2 rounded-lg text-surface-500 hover:bg-surface-50 cursor-pointer',
          currentPage === page ? 'bg-primary-100 text-primary-400' : ''
        ]"
        @click="goToPage(Number(page))">
        {{ page }}
      </button>
    </template>

    <button
      :disabled="currentPage >= totalPages"
      class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-surface-200 text-surface-400 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      @click="goToPage(currentPage + 1)">
      <Icon
        :stroke-width="2"
        class="size-4 text-[#62748E]"
        icon="mdi:chevron-right" />
    </button>

    <button
      :disabled="currentPage >= totalPages"
      class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-surface-200 text-surface-400 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      @click="goToPage(totalPages)">
      <Icon
        :stroke-width="2"
        class="size-4 text-[#62748E]"
        icon="mdi:chevron-double-right" />
    </button>
  </div>

  <div class="flex lg:hidden items-center gap-1">
    <button
      :disabled="currentPage === 1"
      class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-surface-200 text-surface-400 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      @click="goToPage(currentPage - 1)">
      <Icon
        :stroke-width="2"
        class="size-4 text-[#62748E]"
        icon="mdi:chevron-left" />
    </button>

    <button
      v-for="page in mobileVisiblePages"
      :key="page"
      :class="[
        'inline-flex items-center text-[12px] justify-center min-w-7 h-7 px-2 rounded-lg text-surface-500 hover:bg-surface-50 cursor-pointer',
        currentPage === page ? 'bg-primary-100 text-primary-400' : ''
      ]"
      @click="goToPage(page)">
      {{ page }}
    </button>

    <button
      :disabled="currentPage >= totalPages"
      class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-surface-200 text-surface-400 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      @click="goToPage(currentPage + 1)">
      <Icon
        :stroke-width="2"
        class="size-4 text-[#62748E]"
        icon="mdi:chevron-right" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { IPagination } from '@/composables/usePagination'
import { Icon } from '@iconify/vue'

const emits = defineEmits<{
  update: []
}>()

const pagination = defineModel<IPagination>('pagination', {
  default: {
    page: 1,
    totalPage: 1,
    count: 0,
    limit: 10
  }
})

const limitOptions = ref<IPagination['limit'][]>([
  10,
  50,
  100
])

const currentPage = computed({
  get: (): number => pagination.value?.page || 1,
  set: (val: number): void => {
    if (pagination.value) pagination.value.page = val
  }
})

const totalPages = computed((): number => pagination.value.totalPage)

const isMobile = ref<boolean>(false)
let mediaQuery: MediaQueryList | null = null

function handleViewportChange (): void {
  isMobile.value = window.innerWidth < 768
}

onMounted((): void => {
  handleViewportChange()
  mediaQuery = window.matchMedia('(max-width: 767px)')
  mediaQuery.addEventListener('change', handleViewportChange)
})

onBeforeUnmount((): void => {
  mediaQuery?.removeEventListener('change', handleViewportChange)
})

const visiblePages = computed((): (number | string)[] => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

const mobileVisiblePages = computed((): number[] => {
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 3) {
    const pages: number[] = []
    for (let page = 1; page <= total; page++) pages.push(page)
    return pages
  }

  if (current <= 2) return [1, 2, 3]
  if (current >= total - 1) return [total - 2, total - 1, total]
  return [current - 1, current, current + 1]
})

function goToPage (page: number): void {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  emits('update')
}

function onUpdatePagination (): void {
  emits('update')
}

function enforceMobileLimit (): void {
  if (!isMobile.value) return
  if (!pagination.value || pagination.value.limit === 10) return

  pagination.value.limit = 10
  emits('update')
}

watch(isMobile, (): void => {
  enforceMobileLimit()
}, { immediate: true })
</script>

<style scoped>

</style>
