import { ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetDailyInstallmentList } from '@/models/request/report/daliy-installment-payment/DailyInstallmentPayment.model'
import type { IDailyInstallmentPaymentList } from '@/models/response/report/daily-installment-payment/DailyInstallmentPaymentRes'
import usePagination, { type IUsePagination } from '@/composables/usePagination'


interface IDailyInstallment extends IUsePagination {
  filters: Ref<IGetDailyInstallmentList>
  items: Ref<IDailyInstallmentPaymentList[]>
  fetch(): void
  onClearFilters(): void
  onDelete(id: number): void
}
export default function useList (): IDailyInstallment {
  // const DeilyInstallmentService: any = new Provider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery, reset } = usePagination()

  const filters = ref<IGetDailyInstallmentList>({})
  const items = ref<IDailyInstallmentPaymentList[]>([])
  // mock
  const mockResponse: IDailyInstallmentPaymentList[] = [
    {
      id: 1,
      idNo: 'DIP-000001',
      createdAt: '2026-03-10T08:30:00.000Z',
      updatedAt: '2026-03-10T08:30:00.000Z',
      date: '2026-03-10',
      receiptNo: 'RCPT-20260310-001',
      contractNo: 'CT-2026-0001',
      customerName: 'สมชาย ใจดี',
      paymentMethod: 'เงินสด',
      paymentType: 'ชำระรายวัน',
      debtAmount: 3500,
      discount: 100,
      netAmount: 3400,
      totalPrincipal: 2200,
      principal: 1800,
      interest: 1600,
      staffName: 'นภัส ศรีสุข',
      status: 'PAID'
    },
    {
      id: 2,
      idNo: 'DIP-000002',
      createdAt: '2026-03-10T09:15:00.000Z',
      updatedAt: '2026-03-10T09:15:00.000Z',
      date: '2026-03-10',
      receiptNo: 'RCPT-20260310-002',
      contractNo: 'CT-2026-0002',
      customerName: 'พัชรี ทองดี',
      paymentMethod: 'โอนบัญชี',
      paymentType: 'ชำระค่างวด',
      debtAmount: 4200,
      discount: 0,
      netAmount: 4200,
      totalPrincipal: 2600,
      principal: 2200,
      interest: 2000,
      staffName: 'ศุภชัย ชูเกียรติ',
      status: 'PAID'
    },
    {
      id: 3,
      idNo: 'DIP-000003',
      createdAt: '2026-03-10T10:05:00.000Z',
      updatedAt: '2026-03-10T10:05:00.000Z',
      date: '2026-03-10',
      receiptNo: 'RCPT-20260310-003',
      contractNo: 'CT-2026-0003',
      customerName: 'กานต์พิชชา แสงทอง',
      paymentMethod: 'QR พร้อมเพย์',
      paymentType: 'ชำระรายวัน',
      debtAmount: 2800,
      discount: 50,
      netAmount: 2750,
      totalPrincipal: 1700,
      principal: 1450,
      interest: 1300,
      staffName: 'นภัส ศรีสุข',
      status: 'PAID'
    }
  ]

  async function useFetch (): Promise<void> {
    if (mockResponse.length) {
      items.value = mockResponse
      pagination.value.count = mockResponse.length
      pagination.value.totalPage = 1
      syncQuery({ ...normalizeFilters(filters.value) })
      return
    }
    // const response = await DeilyInstallmentService.getDeilyInstallmentPaginate(paginateQuery.value)
    // items.value = response?.data || []
    // pagination.value = extractPagination(response)
    // syncQuery({ ...normalizeFilters(filters.value) })
  }

  async function useDelete (id: number): Promise<void> {
    console.info(id)
    // await DeilyInstallmentService.deleteDeilyInstallment(id)
    fetch()
    toast.success('ลบลูกค้าสําเร็จ')
  }

  function normalizeFilters (value: any): Partial<any> {
    return {
      ...value
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {
    reset()
    filters.value = {}
  }

  function onDelete (id: number): void {
    handleLoading((): Promise<void> => useDelete(id))
  }

  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    fetch,
    onClearFilters,
    onDelete,
    extractPagination,
    syncQuery,
    reset
  }
}
