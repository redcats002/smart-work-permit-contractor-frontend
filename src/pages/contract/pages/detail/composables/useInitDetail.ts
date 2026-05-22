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
    outstanding: data?.outstanding || { interest: 0, principal: 0, total: 0 },
    periodCount: data?.periodCount || 0,
    annualInterestRate: data?.annualInterestRate || 0,
    contractLoanPurpose: {
      name: data?.contractLoanPurpose?.name || '',
      id: typeof data?.contractLoanPurpose?.id === 'string' ? data?.contractLoanPurpose?.id : String(data?.contractLoanPurpose?.id)
    },
    finalInstallment: data?.finalInstallment || 0,
    finalInstallmentDate: data?.finalInstallmentDate || '',
    firstInstallmentDate: data?.firstInstallmentDate || '',
    guarantors: data?.guarantors || [],
    contractLoanType: {
      name: data?.contractLoanType?.name || '',
      id: typeof data?.contractLoanType?.id === 'string' ? data?.contractLoanType?.id : String(data?.contractLoanType?.id)
    },
    borrowers: data?.borrowers || [],
    sellMan: {
      title: data?.sellMan?.title || '',
      firstName: data?.sellMan?.firstName || '',
      lastName: data?.sellMan?.lastName || '',
      phoneNumber: data?.sellMan?.phoneNumber || '',
      status: data?.sellMan?.status || 'ACTIVE',
      id: typeof data?.sellMan?.id === 'string' ? data?.sellMan?.id : String(data?.sellMan?.id)
    },
    id: typeof data?.id === 'string' ? data?.id : String(data?.id),
    howDidFindUs: {
      name: data?.howDidFindUs?.name || '',
      id: typeof data?.howDidFindUs?.id === 'string' ? data?.howDidFindUs?.id : String(data?.howDidFindUs?.id)
    },
    interestAmount: data?.interestAmount || 0,
    interestType: data?.interestType,
    lastPeriodPayment: data?.lastPeriodPayment || 0,
    loanAmount: data?.loanAmount || 0,
    lateFee: data?.lateFee || 0,
    perMonthPayment: data?.perMonthPayment || 0,
    contractedAt: data?.contractedAt || '',
    installmentCount: data?.installmentCount || 0,
    monthlyInstallment: data?.monthlyInstallment || 0,
    totalInterest: data?.totalInterest || 0,
    status: data?.status || 'PENDING'
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
    { key: 'Asset', label: 'หลักทรัพย์', instance: Asset, value: 'asset' },
    { key: 'Installment', label: 'ตารางการชำระ', instance: Installment, value: 'installment' },
    { key: 'Expense', label: 'ค่าใช้จ่าย', instance: Expense, value: 'expense' },
    { key: 'Income', label: 'รายได้', instance: Income, value: 'income' },
    { key: 'Guarantor', label: 'ผู้ค้ำประกัน', instance: Guarantor, value: 'guarantor' },
    { key: 'ContactHistory', label: 'ประวัติการติดต่อ', instance: ContactHistory, value: 'contact-history' },
    { key: 'Document', label: 'รายการเอกสาร', instance: Document, value: 'document' }
  ])

  return useTabItems(input)
}
