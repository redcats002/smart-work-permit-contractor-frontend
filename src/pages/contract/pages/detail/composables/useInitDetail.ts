import { type Component, computed, ref, type Ref } from 'vue'
import type { IContractById } from '@/models/response/contract/ContractRes.model'
import type AssetTab from '../components/tab/asset/AssetTab.vue'
import type ContactHistoryTab from '../components/tab/contact-history/ContactHistoryTab.vue'
import type DocumentTab from '../components/tab/document/DocumentTab.vue'
import type ExpenseTab from '../components/tab/expense/ExpenseTab.vue'
import type GuarantorTab from '../components/tab/guarantor/GuarantorTab.vue'
import type IncomeTab from '../components/tab/income/IncomeTab.vue'
import type InformationTab from '../components/tab/information/InformationTab.vue'
import type InstallmentTab from '../components/tab/installment/InstallmentTab.vue'
import useTabItems, {
  importComponent,
  type ITabItemComponent,
  type IUseTabItems
} from '@/composables/useTabItems'

export function useInitDetail (data?: Partial<IContractById>): Ref<IContractById> {
  return ref<IContractById>({
    ...data,
    customers: [],
    employee: {
      id: 0,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      status: 'ACTIVE',
      titleName: ''
    },
    guarantors: [],
    id: 0,
    interestAmount: 0,
    lastPeriodPayment: 0,
    loanAmount: 0,
    periodCount: 0,
    perMonthPayment: 0,
    lateFee: 0,
    status: 'SUCCESS',
    contractLoanPurpose: {
      id: 0,
      name: ''
    },
    howDidFindUs: {
      id: 0,
      name: ''
    },
    contractLoanType: {
      id: 0,
      name: ''
    },
    startDate: '',
    endDate: '',
    interestType: undefined,
    annualInterestRate: 0
  })
}

export type ListComponentType
  = | InstanceType<typeof InformationTab>
    | InstanceType<typeof AssetTab>
    | InstanceType<typeof InstallmentTab>
    | InstanceType<typeof ExpenseTab>
    | InstanceType<typeof IncomeTab>
    | InstanceType<typeof GuarantorTab>
    | InstanceType<typeof ContactHistoryTab>
    | InstanceType<typeof DocumentTab>

export function useInitTabDetail (): IUseTabItems {
  const Information = importComponent((): Promise<Component> => import('../components/tab/information/InformationTab.vue'))
  const Asset = importComponent((): Promise<Component> => import('../components/tab/asset/AssetTab.vue'))
  const Installment = importComponent((): Promise<Component> => import('../components/tab/installment/InstallmentTab.vue'))
  const Expense = importComponent((): Promise<Component> => import('../components/tab/expense/ExpenseTab.vue'))
  const Income = importComponent((): Promise<Component> => import('../components/tab/income/IncomeTab.vue'))
  const Guarantor = importComponent((): Promise<Component> => import('../components/tab/guarantor/GuarantorTab.vue'))
  const ContactHistory = importComponent((): Promise<Component> => import('../components/tab/contact-history/ContactHistoryTab.vue'))
  const Document = importComponent((): Promise<Component> => import('../components/tab/document/DocumentTab.vue'))

  const input = computed((): ITabItemComponent[] => [
    { key: 'Information', label: 'รายละเอียด', instance: Information, value: 'information' },
    { key: 'Asset', label: 'ทรัพย์สิน', instance: Asset, value: 'asset' },
    { key: 'Installment', label: 'งวดชำระ', instance: Installment, value: 'installment' },
    { key: 'Expense', label: 'ค่าใช้จ่าย', instance: Expense, value: 'expense' },
    { key: 'Income', label: 'รายรับ', instance: Income, value: 'income' },
    { key: 'Guarantor', label: 'ผู้ค้ำประกัน', instance: Guarantor, value: 'guarantor' },
    { key: 'ContactHistory', label: 'ประวัติการติดต่อ', instance: ContactHistory, value: 'contact-history' },
    { key: 'Document', label: 'เอกสาร', instance: Document, value: 'document' }
  ])

  return useTabItems(input)
}
