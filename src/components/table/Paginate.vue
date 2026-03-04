<template>
  <div class="text-sm text-[#333333] flex items-center gap-2.5">
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
  <div class="flex items-center gap-1">
    <!-- First page -->
    <button
      :disabled="currentPage === 1"
      class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-surface-200 text-surface-400 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      @click="goToPage(1)">
      <Icon
        :stroke-width="2"
        class="size-4 text-[#62748E]"
        icon="mdi:chevron-double-left" />
    </button>
    <!-- Previous page -->
    <button
      :disabled="currentPage === 1"
      class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-surface-200 text-surface-400 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      @click="goToPage(currentPage - 1)">
      <Icon
        :stroke-width="2"
        class="size-4 text-[#62748E]"
        icon="mdi:chevron-left" />
    </button>

    <!-- Page numbers -->
    <template
      v-for="page in visiblePages"
      :key="page">
      <span
        v-if="page === '...'"
        class="px-2 text-surface-400">
        <Icon
          class="size-4 text-[#62748E]"
          icon="mdi:ellipse-outline" />
      </span>
      <button
        v-else
        :class="[
          'inline-flex items-center text-[12px] justify-center min-w-7 h-7 px-2 rounded-lg text-surface-500 hover:bg-surface-50 cursor-pointer',
          currentPage === page ? 'bg-[#FFF6E5] text-orange-400' : ''
        ]"
        @click="goToPage(Number(page))">
        {{ page }}
      </button>
    </template>

    <!-- Next page -->
    <button
      :disabled="currentPage >= totalPages"
      class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-surface-200 text-surface-400 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      @click="goToPage(currentPage + 1)">
      <Icon
        :stroke-width="2"
        class="size-4 text-[#62748E]"
        icon="mdi:chevron-right" />
    </button>
    <!-- Last page -->
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
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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

function goToPage (page: number): void {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  emits('update')
}

function onUpdatePagination (): void {
  emits('update')
}
</script>

<style scoped>

</style>
