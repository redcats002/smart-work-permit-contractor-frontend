import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type StockDocsFormValues,
  useFormInitialValues,
  useDev
} from '../pages/stock/pages/create/schema/stockDocs.schema'
import type { IStockList } from '@/models/response/stock/StockRes.model'

interface IStockDocsStore {
  form: Ref<StockDocsFormValues>
  setForm(data: StockDocsFormValues): void
  resetForm(): void
  addItem(item: IStockList): void
  removeItem(id: number): void
  loadDevData(): void
}

export const useStockDocsStore = defineStore('StockDocs', (): IStockDocsStore => {
  const form = ref<StockDocsFormValues>(useFormInitialValues())

  function setForm (data: StockDocsFormValues): void {
    form.value = { ...data }
  }

  function resetForm (): void {
    form.value = useFormInitialValues()
  }

  function addItem (item: IStockList): void {
    const isExist = form.value.items.some((i: any): boolean => i.id === item.id)
    if (!isExist) {
      form.value.items.push(item as any)
    }
  }

  function removeItem (id: number): void {
    form.value.items = form.value.items.filter((i: any): boolean => i.id !== id)
  }

  function loadDevData (): void {
    form.value = useDev()
  }

  return {
    form,
    setForm,
    resetForm,
    addItem,
    removeItem,
    loadDevData
  }
}, {
  persist: {
    key: 'stock-docs-storage',
    pick: ['form'],
    storage: localStorage
  }
})

export default { useStockDocsStore }
