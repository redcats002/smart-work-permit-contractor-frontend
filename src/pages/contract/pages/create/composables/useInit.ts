import { computed, type ComputedRef, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { useAuthStore } from '@/stores/Auth'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/asset/AssetType.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import CustomerProvider, { type ICustomerProvider } from '@/resources/provider/customer/Customer.provider'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import type { FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import {
  createPreAssetBase,
  type PreContractFormValues,
  PreContractSchema,
  type TAssetCategory,
  useDev,
  useFormInitialValues
} from '../schema/pre-contract.schema'
import { usePayload } from './usePayload'

export interface IUseInit {
  formKey: Ref<number>
  form: Ref<PreContractFormValues>
  submitMode: Ref<TPreContractStatus>
  selectedCustomer: Ref<ICustomerById | null>
  assetCategory: ComputedRef<TAssetCategory>
  canAddAsset: ComputedRef<boolean>
  mount (): void
  resolver: ReturnType<typeof zodResolver>
  onCustomerSelect: (id?: TBaseParamsId | null) => Promise<void>
  onSubmit: (event: FormSubmitEvent) => void
  onAddAsset: () => void
  onRemoveAsset: (index: number) => void
  onCancel: () => void
  setSubmitMode: (mode: TPreContractStatus) => void
  onAuto: () => void
  onInitSellMan: () => void
}

export function useInit (): IUseInit {
  const authStore = useAuthStore()
  const router = useRouter()

  const CustomerService: ICustomerProvider = new CustomerProvider()
  const ContractService: IPreContractProvider = new PreContractProvider()

  const formKey = ref<number>(0)
  const form = ref<PreContractFormValues>(useFormInitialValues())
  const resolver = zodResolver(PreContractSchema)
  const submitMode = ref<TPreContractStatus>('DRAFT')
  const selectedCustomer = ref<ICustomerById | null>(null)

  const assetCategory = computed((): TAssetCategory => {
    for (const e of form.value.preAssets) {
      if (isVehicleAsset(e.type)) return 'VEHICLE'
      if (isLandAsset(e.type)) return 'LAND'
    }
    return null
  })

  const canAddAsset = computed((): boolean => {
    if (!assetCategory.value) return false
    return assetCategory.value !== 'VEHICLE'
  })

  async function onCustomerSelect (id?: TBaseParamsId | null): Promise<void> {
    await handleLoading(async (): Promise<void> => {
      if (!id) return
      const res = await CustomerService.getCustomerFindOne(Number(id))
      selectedCustomer.value = res.data
    })
  }

  async function useSubmit (): Promise<void> {
    const response = await ContractService.createContract(usePayload({ ...form.value, status: submitMode.value }, selectedCustomer.value!))
    toast.success('ดำเนินการสำเร็จ')
    if (submitMode.value === 'DRAFT') {
      router.push({ name: 'PreContractEditPage', params: { id: response?.id } })
      return
    }
    router.push({ name: 'PreContractDetailPage', params: { id: response?.id } })
  }

  function onSubmit (event: FormSubmitEvent): void {
    if (!event.valid) {
      scrollToFirstError(event.errors)
      return
    }
    handleLoading(useSubmit)
  }


  function onAddAsset (): void {
    if (!canAddAsset.value) return
    form.value.preAssets.push(createPreAssetBase())
    formKey.value++
  }

  function onRemoveAsset (index: number): void {
    if (form.value.preAssets.length <= 1) return
    form.value.preAssets.splice(index, 1)
    formKey.value++
  }

  function onCancel (): void {
    router.push({ name: 'ContractListPage' })
  }

  function setSubmitMode (mode: TPreContractStatus): void {
    submitMode.value = mode
  }

  function onAuto (): void {
    form.value = { ...useDev() }
    formKey.value++
    onCustomerSelect(form.value.customerId)
  }

  function onInitSellMan (): void {
    if (authStore.isSeedAccount) return
    form.value.sellManId = authStore.user.id
    formKey.value++
  }

  function mount (): void {
    formKey.value++
  }

  return {
    formKey,
    form,
    submitMode,
    selectedCustomer,
    assetCategory,
    canAddAsset,
    resolver,
    onCustomerSelect,
    onSubmit,
    onAddAsset,
    onRemoveAsset,
    onCancel,
    setSubmitMode,
    onAuto,
    onInitSellMan,
    mount
  }
}
