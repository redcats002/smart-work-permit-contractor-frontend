import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IAssetList, IAssetMovementItem, IDocumentMovementById } from '@/models/response/document-storage/DocumentStorageRes.model'
import type { IDocumentStorageProvider } from '@/resources/provider/document-storages/DocumentStorage.provider'
import DocumentStorageProvider from '@/resources/provider/document-storages/DocumentStorage.provider'
import type { DocumentReceiveFormValues, DocumentReceiveItemFormValues } from '../schema/document-receive.schema'
import { usePayload } from './usePayload'

interface IUseDetail {
  data: Ref<IDocumentMovementById>
  form: Ref<DocumentReceiveFormValues>
  isSuccess: ComputedRef<boolean>
  fetch(): void
  onSubmit(): void
  onCancel(): void
  onDelete(): void
  onEdit(): void
}

export default function useDetail (): IUseDetail {
  const route = useRoute()
  const router = useRouter()

  const DocumentStorageService: IDocumentStorageProvider = new DocumentStorageProvider()
  const documentId = computed((): number => Number(route.params.id))

  const data = ref<IDocumentMovementById>(useInit())
  const form = ref<DocumentReceiveFormValues>(useInitForm())

  const isSuccess = computed((): boolean => {
    return data.value.status === 'SUCCESS'
  })


  async function useFetch (): Promise<void> {
    const response = await DocumentStorageService.getDocumentMovementFindOne(documentId.value)
    data.value = useInit(response.data)
    form.value = useInitForm(response.data)
  }

  function useInit (data?: IDocumentMovementById): IDocumentMovementById {
    return {
      ...data,
      asset: data?.asset || ({
        assetNo: data?.asset?.assetNo || '',
        customerName: data?.asset?.customerName || '',
        category: data?.asset?.category || '',
        value: data?.asset?.value || 0,
        status: data?.asset?.status || '',
        type: data?.asset?.type || 'NS3K_VACANT_LAND',
        detail: data?.asset?.detail || '',
        contract: {
          status: data?.asset?.contract?.status || 'CANCELLED',
          contractedAt: data?.asset?.contract?.contractedAt || '',
          contractLoanType: data?.asset?.contract?.contractLoanType || {},
          loanAmount: data?.asset?.contract?.loanAmount || 0,
          firstInstallmentDate: data?.asset?.contract?.firstInstallmentDate || '',
          finalInstallmentDate: data?.asset?.contract?.finalInstallmentDate || '',
          id: data?.asset?.contract?.id || 0,
          contractDate: data?.asset?.contract?.contractDate || '',
          startDate: data?.asset?.contract?.startDate || '',
          endDate: data?.asset?.contract?.endDate || '',
          amount: data?.asset?.contract?.amount || 0,
          customer: data?.asset?.contract?.customer || { id: 0, firstName: '', lastName: '', titleName: '' },
          loanType: data?.asset?.contract?.loanType || {}
        },
        id: data?.asset?.id || 0
      } as IAssetList),
      createdByEmployee: data?.createdByEmployee || {
        titleName: data?.createdByEmployee?.titleName || '',
        firstName: data?.createdByEmployee?.firstName || '',
        lastName: data?.createdByEmployee?.lastName || '',
        phoneNumber: data?.createdByEmployee?.phoneNumber || '',
        status: data?.createdByEmployee?.status || 'ACTIVE',
        id: data?.createdByEmployee?.id || ''
      },
      destinationWarehouse: data?.destinationWarehouse || {
        name: data?.destinationWarehouse?.name || '',
        status: data?.destinationWarehouse?.status || 'ACTIVE',
        id: data?.destinationWarehouse?.id || ''
      },
      id: data?.id || 0,
      originWarehouse: data?.originWarehouse || {
        name: data?.originWarehouse?.name || '',
        status: data?.originWarehouse?.status || 'ACTIVE',
        id: data?.originWarehouse?.id || ''
      },
      receivedByEmployee: data?.receivedByEmployee || {
        titleName: data?.receivedByEmployee?.titleName || '',
        firstName: data?.receivedByEmployee?.firstName || '',
        lastName: data?.receivedByEmployee?.lastName || '',
        phoneNumber: data?.receivedByEmployee?.phoneNumber || '',
        status: data?.receivedByEmployee?.status || 'ACTIVE',
        id: data?.receivedByEmployee?.id || ''
      },
      status: data?.status || 'WAITING_RECEIVE',
      items: data?.items || []
    }
  }

  function useInitForm (data?: IDocumentMovementById): DocumentReceiveFormValues {
    return {
      items: (data?.items ?? []).map((e: IAssetMovementItem): DocumentReceiveItemFormValues => ({
        location: {
          id: undefined,
          name: ''
        },
        id: e.id
      }))
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onCancel (): void {
    router.push({ name: 'DocumentMovementListPage' })
  }

  async function useSubmit (): Promise<void> {
    await DocumentStorageService.receiveDocumentMovement(documentId.value, usePayload(form.value))
    toast.success('ดำเนินการสำเร็จ')
    fetch()
  }

  function onSubmit (): void {
    handleLoading(useSubmit)
  }

  function onDelete (): void {}

  function onEdit (): void {
    // router.push({ name: 'DocumentMovementEditPage' })
  }

  return {
    data,
    isSuccess,
    form,
    fetch,
    onSubmit,
    onCancel,
    onDelete,
    onEdit
  }
}
