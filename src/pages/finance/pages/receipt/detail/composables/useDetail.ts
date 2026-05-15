import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IReceiptById } from '@/models/response/receipt/ReceiptRes.model'
import { ETitleName } from '@/enums/TitleName.enum'
import ReceiptProvider, { type IReceiptProvider } from '@/resources/provider/receipt/Receipt.provider'

interface IUseDetail {
  form: Ref<IReceiptById>
  fetchById(): void
}

export default function useDetail (): IUseDetail {
  const ReceiptService: IReceiptProvider = new ReceiptProvider()
  const route = useRoute()
  const invoiceId = computed((): number => Number(route.params.id))

  const form = ref<IReceiptById>({
    id: 0,
    idNo: '',
    createdAt: '',
    paidAt: '',
    paymentType: null,
    createBy: {
      id: '',
      idNo: '',
      fullName: ''
    },
    receivedBy: {
      id: '',
      idNo: '',
      fullName: ''
    },
    customer: {
      id: 0,
      idCard: '',
      titleName: ETitleName[''],
      firstName: '',
      lastName: '',
      birthDate: null,
      customerGroup: null,
      occupation: null,
      phoneNumber: null,
      email: null
    },
    branch: {
      id: '',
      name: ''
    },
    contracts: [],
    summary: {
      principal: 0,
      interest: 0,
      totalInstallment: 0,
      penaltyFee: 0,
      collectionFee: 0,
      legalFee: 0
    }
  })
  function fetchById (): void {
    handleLoading(useFetchById)
  }

  async function useFetchById (): Promise<void> {
    const response = await ReceiptService.getReceiptById(invoiceId.value)
    form.value = response.data
  }
  return {
    form,
    fetchById
  }
}
