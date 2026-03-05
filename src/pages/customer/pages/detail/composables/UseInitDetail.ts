import { type Component, computed, defineAsyncComponent as dac, markRaw, ref, type Ref } from 'vue'
import type { ICustomerById } from '@/models/response/customer/CustomerRes.model'
import type AddressTab from '../components/tab/address/AddressTab.vue'
import type ContactHistoryTab from '../components/tab/contact-history/ContactHistoryTab.vue'
import type ContractTab from '../components/tab/contract/ContractTab.vue'
import type EstateTab from '../components/tab/estate/EstateTab.vue'
import type PaymentHistoryTab from '../components/tab/payment-history/PaymentHistoryTab.vue'
import type PrivateDocumentTab from '../components/tab/private-document/PrivateDocumentTab.vue'
import useTabItems, {
  type ITabItemComponent,
  type IUseTabItems
} from '@/composables/useTabItems'

export function useInitDetail (): Ref<ICustomerById> {
  return ref<ICustomerById>({
    customerStatus: 'ACTIVE',
    citizenId: '',
    titleName: 'MR',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    currentAddress: '',
    currentSubDistrict: '',
    currentDistrict: '',
    currentProvince: '',
    currentPostalCode: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: '',
    workAddress: '',
    workSubDistrict: '',
    workDistrict: '',
    workProvince: '',
    workPostalCode: ''
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
  const Address = markRaw(dac((): Promise<Component> => import('../components/tab/address/AddressTab.vue')))
  const PrivateDocument = markRaw(dac((): Promise<Component> => import('../components/tab/private-document/PrivateDocumentTab.vue')))
  const Contract = markRaw(dac((): Promise<Component> => import('../components/tab/contract/ContractTab.vue')))
  const PaymentHistory = markRaw(dac((): Promise<Component> => import('../components/tab/payment-history/PaymentHistoryTab.vue')))
  const ContactHistory = markRaw(dac((): Promise<Component> => import('../components/tab/contact-history/ContactHistoryTab.vue')))
  const Estate = markRaw(dac((): Promise<Component> => import('../components/tab/estate/EstateTab.vue')))

  const input = computed((): ITabItemComponent[] => [
    { key: 'Address', title: 'ที่อยู่', instance: Address },
    { key: 'PrivateDocument', title: 'เอกสารส่วนตัว', instance: PrivateDocument },
    { key: 'Contract', title: 'สัญญา', instance: Contract },
    { key: 'PaymentHistory', title: 'ประวัติการชำระเงิน', instance: PaymentHistory },
    { key: 'ContactHistory', title: 'ประวัติการติดต่อ', instance: ContactHistory },
    { key: 'Estate', title: 'หลักทรัพย์', instance: Estate }
  ])

  return useTabItems(input)
}
