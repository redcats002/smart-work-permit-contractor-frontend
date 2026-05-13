import { ref, type Ref } from 'vue'
import type { IDocumentAssetList } from '@/models/response/document-storage/DocumentStorageRes.model'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import type { AssetTypeEnum } from '@/enums/modules/asset/AssetType.enum'
import type { CustomerStatusEnum } from '@/enums/modules/customer/CustomerStatus.enum'
import type { WarehouseStatusEnum } from '@/enums/modules/warehouse/WarehouseStatus.enum'
import type { DocumentAssetFormValues } from '@/pages/stock/pages/create/schema/document-asset.schema'
import { type DocumentMovementFormValues, useDev, useFormInitialValues } from '../schema/document-movement'

interface IUseDocumentMovement {
  form: Ref<DocumentMovementFormValues>
  formKey: Ref<number>
  setForm(data: DocumentMovementFormValues): void
  resetForm(): void
  addItem(item: IDocumentAssetList): void
  removeItem(id: number): void
  loadDevData(): void
}

export function useDocumentMovement (): IUseDocumentMovement {
  const form = ref<DocumentMovementFormValues>(useFormInitialValues())
  const formKey = ref<number>(0)

  function setForm (data: DocumentMovementFormValues): void {
    form.value = { ...data }
  }

  function resetForm (): void {
    form.value = useFormInitialValues()
  }

  function addItem (item: IDocumentAssetList): void {
    const isExist = form.value.assets.some((e: DocumentAssetFormValues): boolean => e?.id === item.id)
    if (!isExist) {
      form.value.assets.push({
        id: item.id,
        idNo: item.idNo,
        location: {
          id: item.location?.id || '',
          name: item.location?.name || '',
          warehouse: {
            id: item.location?.warehouse?.id || '',
            name: item.location?.warehouse?.name || '',
            status: item.location?.warehouse?.status as WarehouseStatusEnum
          }
        },
        status: item?.status as TAssetStatus,
        type: item?.type as AssetTypeEnum,
        contract: {
          id: item?.contract?.id || '',
          idNo: item?.contract?.idNo || '',
          customer: {
            id: item?.contract?.customer?.id || '',
            firstName: item?.contract?.customer?.firstName || '',
            lastName: item?.contract?.customer?.lastName || '',
            titleName: item?.contract?.customer?.titleName || '',
            phoneNumber: item?.contract?.customer?.phoneNumber || '',
            status: item?.contract?.customer?.status as CustomerStatusEnum
          }
        }
      })
    }
  }

  function removeItem (id: number): void {
    form.value.assets = form.value.assets.filter((e: DocumentAssetFormValues): boolean => e.id !== id)
  }

  function loadDevData (): void {
    form.value = useDev()
    formKey.value++
  }

  return {
    form,
    formKey,
    setForm,
    resetForm,
    addItem,
    removeItem,
    loadDevData
  }
}

export default { useStockMovementStore: useDocumentMovement }
