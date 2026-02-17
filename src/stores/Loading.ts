import { defineStore } from 'pinia'
import { computed, ref, type ComputedRef } from 'vue'

export interface ILoadingStore {
  isLoading: ComputedRef<boolean>
  addLoading(): void
  removeLoading(): void
}

export const useLoadingStore = defineStore<'Loading', ILoadingStore>('Loading', (): ILoadingStore => {
  const loadingCount = ref<number>(0)
  const isLoading = computed<boolean>((): boolean => !!loadingCount.value)

  function addLoading (): void {
    loadingCount.value++
  }

  function removeLoading (): void {
    const count = loadingCount.value - 1
    loadingCount.value = count < 0 ? 0 : count
  }

  return {
    isLoading,
    addLoading,
    removeLoading
  }
}, {
  persist: false
})
