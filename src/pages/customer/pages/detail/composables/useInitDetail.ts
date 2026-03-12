import { type Component, computed, ref, type Ref } from 'vue'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type AddressTab from '../components/tab/address/AddressTab.vue'
import type ContactHistoryTab from '../components/tab/contact-history/ContactHistoryTab.vue'
import type ContractTab from '../components/tab/contract/ContractTab.vue'
import type EstateTab from '../components/tab/estate/EstateTab.vue'
import type PaymentHistoryTab from '../components/tab/payment-history/PaymentHistoryTab.vue'
import type PrivateDocumentTab from '../components/tab/private-document/PrivateDocumentTab.vue'
import useTabItems, {
  importComponent,
  type ITabItemComponent,
  type IUseTabItems
} from '@/composables/useTabItems'

export function useInitDetail (data?: Partial<ICustomerById>): Ref<ICustomerById> {
  return ref<ICustomerById>({
    ...data,
    id: data?.id ?? 0,
    status: data?.status ?? 'ACTIVE',
    idCard: data?.idCard ?? '',
    titleName: data?.titleName ?? 'MR',
    firstName: data?.firstName ?? '',
    lastName: data?.lastName ?? '',
    phoneNumber: data?.phoneNumber ?? '',
    birthDate: data?.birthDate ?? '',
    email: data?.email ?? '',
    mainAddress: {
      address: data?.mainAddress?.address ?? '',
      subDistrict: data?.mainAddress?.subDistrict ?? '',
      district: data?.mainAddress?.district ?? '',
      province: data?.mainAddress?.province ?? '',
      postCode: data?.mainAddress?.postCode ?? '',
      urlGoogleMap: data?.mainAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: data?.mainAddress?.isSameCitizenAddress ?? false,
      isSameCurrentAddress: data?.mainAddress?.isSameCurrentAddress ?? false
    },
    currentAddress: {
      address: data?.currentAddress?.address ?? '',
      subDistrict: data?.currentAddress?.subDistrict ?? '',
      district: data?.currentAddress?.district ?? '',
      province: data?.currentAddress?.province ?? '',
      postCode: data?.currentAddress?.postCode ?? '',
      urlGoogleMap: data?.currentAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: data?.currentAddress?.isSameCitizenAddress ?? false,
      isSameCurrentAddress: data?.currentAddress?.isSameCurrentAddress ?? false
    },
    workAddress: {
      address: data?.workAddress?.address ?? '',
      subDistrict: data?.workAddress?.subDistrict ?? '',
      district: data?.workAddress?.district ?? '',
      province: data?.workAddress?.province ?? '',
      postCode: data?.workAddress?.postCode ?? '',
      urlGoogleMap: data?.workAddress?.urlGoogleMap ?? '',
      isSameCitizenAddress: data?.workAddress?.isSameCitizenAddress ?? false,
      isSameCurrentAddress: data?.workAddress?.isSameCurrentAddress ?? false
    }
  })
}

export type ListComponentType =
  | InstanceType<typeof AddressTab>
  | InstanceType<typeof PrivateDocumentTab>
  | InstanceType<typeof ContractTab>
  | InstanceType<typeof PaymentHistoryTab>
  | InstanceType<typeof ContactHistoryTab>
  | InstanceType<typeof EstateTab>

export function useInitTabDetail (): IUseTabItems {
  const Address = importComponent((): Promise<Component> => import('../components/tab/address/AddressTab.vue'))
  const PrivateDocument = importComponent((): Promise<Component> => import('../components/tab/private-document/PrivateDocumentTab.vue'))
  const Contract = importComponent((): Promise<Component> => import('../components/tab/contract/ContractTab.vue'))
  const PaymentHistory = importComponent((): Promise<Component> => import('../components/tab/payment-history/PaymentHistoryTab.vue'))
  const ContactHistory = importComponent((): Promise<Component> => import('../components/tab/contact-history/ContactHistoryTab.vue'))
  const Estate = importComponent((): Promise<Component> => import('../components/tab/estate/EstateTab.vue'))

  const input = computed((): ITabItemComponent[] => [
    { key: 'Address', label: 'ที่อยู่', instance: Address, value: 'address' },
    { key: 'PrivateDocument', label: 'เอกสารส่วนตัว', instance: PrivateDocument, value: 'private-document' },
    { key: 'Contract', label: 'สัญญา', instance: Contract, value: 'contract' },
    { key: 'PaymentHistory', label: 'ประวัติการชำระเงิน', instance: PaymentHistory, value: 'payment-history' },
    { key: 'ContactHistory', label: 'ประวัติการติดต่อ', instance: ContactHistory, value: 'contact-history' },
    { key: 'Estate', label: 'หลักทรัพย์', instance: Estate, value: 'estate' }
  ])

  return useTabItems(input)
}
