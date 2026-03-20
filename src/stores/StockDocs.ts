import { ref, type Ref } from 'vue'
import type { IDocumentAssetList } from '@/models/response/document-storage/DocumentStorageRes.model'
import { type DocumentMovementFormValues, useDev, useFormInitialValues } from '../pages/stock/pages/create/schema/document-movement'
import { defineStore } from 'pinia'

interface IStockDocsStore {
  form: Ref<DocumentMovementFormValues>
  setForm(data: DocumentMovementFormValues): void
  resetForm(): void
  addItem(item: IDocumentAssetList): void
  removeItem(id: number): void
  loadDevData(): void
}

export const useStockDocsStore = defineStore('StockDocs', (): IStockDocsStore => {
  const form = ref<DocumentMovementFormValues>(useFormInitialValues())

  function setForm (data: DocumentMovementFormValues): void {
    form.value = { ...data }
  }

  function resetForm (): void {
    form.value = useFormInitialValues()
  }

  function addItem (item: IDocumentAssetList): void {
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
