import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import PreContractProvider from '@/resources/provider/pre-contract/PreContract.provider'
import type { FormSubmitEvent } from '@primevue/forms'
import type { IUseInit as IUseInitCreate } from '../../create/composables/useInit'
import { useInit as useInitCreate } from '../../create/composables/useInit'
import type { PreAssetFormValues } from '../../create/schema/pre-contract.schema'
import { usePayload } from './usePayload'

interface IUseInit extends Omit<IUseInitCreate, 'fetch' | 'onSubmit' | 'useFetch'> {
  fetch: () => void
  onSubmit (event: FormSubmitEvent): void
}

export function useInit (): IUseInit {
  const ContractService = new PreContractProvider()

  const route = useRoute()
  const router = useRouter()
  const initCreate = useInitCreate()

  const preContractId = computed((): TBaseParamsId => route?.params?.id)

  async function useSubmit (): Promise<void> {
    await ContractService.updateContract(
      preContractId.value, usePayload({ ...initCreate.form.value, status: initCreate.submitMode.value }, initCreate.selectedCustomer.value!)
    )
    toast.success('ดำเนินการสำเร็จ')
    router.push({ name: 'PreContractDetailPage', params: { id: preContractId.value } })
  }

  async function useFetch (): Promise<void> {
    const res = await ContractService.getContractFindOne(preContractId.value)
    initCreate.form.value = {
      preAssets: res.data.preAssets.map(
        (c: IPreAssetList): PreAssetFormValues => ({
          detail: c?.detail || '',
          type: c.type,
          images: c.images || [],
          realEstateForm: c?.realEstateForm,
          vehicleForm: c?.vehicleForm
        })
      ),
      customerId: res.data.customer.id,
      sellManId: res.data.sellMan.id,
      status: res.data.status
    }
    initCreate.onCustomerSelect(res.data.customer.id)
    initCreate.formKey.value++
  }

  function onSubmit (event: FormSubmitEvent): void {
    if (!event.valid) {
      scrollToFirstError(event.errors)
      return
    }
    handleLoading(useSubmit)
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  return {
    ...initCreate,
    fetch,
    onSubmit
  }
}
