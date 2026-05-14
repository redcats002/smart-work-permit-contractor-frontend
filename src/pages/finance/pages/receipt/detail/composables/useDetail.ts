import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IReceiptById } from '@/models/response/receipt/ReceiptRes.model'
import { ETitleName } from '@/enums/TitleName.enum'
import ReceiptProvider, { type IReceiptProvider } from '@/resources/provider/receipt/receipt.provider'

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
    contractId: null,
    receiptNo: null,
    contractNo: null,
    dateOfPayment: null,
    branch: null,
    paymentChannel: null,
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
    officer: {
      id: 0,
      idCard: '',
      titleName: ETitleName[''],
      firstName: '',
      lastName: ''
    },
    totalValue: null,
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postCode: '',
    items: [],
    outstanding: null,
    interest: null,
    principal: null,
    paymentGroups: []
  })
  function fetchById (): void {
    handleLoading(useFetchById)
  }

  async function useFetchById (): Promise<void> {
    const isNoApi = true
    if (isNoApi) {
      form.value = {
        id: 124121221,
        contractId: null,
        receiptNo: 'RCPT-00001',
        contractNo: 'LC-00001',
        dateOfPayment: '2024-03-12T00:00:00.000Z',
        branch: 'ขอนแก่น',
        paymentChannel: 'เงินสด',
        customer: {
          id: 124121221,
          idCard: '1233030390122',
          titleName: ETitleName.MR,
          firstName: 'จันทร์',
          lastName: 'พงษ์พัฒนโยธิน',
          birthDate: '1997-03-12T00:00:00.000Z',
          customerGroup: { id: 1, name: 'ลูกค้าใหม่' },
          occupation: { id: 1, name: 'พนักงานบริษัท' },
          phoneNumber: '088-8888888',
          email: 'Pichai@mail.com'
        },
        address: 'อาคารเลขที่ 128 ถนนพญาไท',
        subDistrict: 'แขวงถนนพญาไท',
        district: 'เขตราชเทวี',
        province: 'กรุงเทพมหานคร',
        postCode: '10400',
        totalValue: 23000,
        items: [],
        officer: {
          id: 0,
          idCard: '1-2345-67890-12-3',
          titleName: ETitleName.MR,
          firstName: 'สมชาย',
          lastName: 'ใจดี'
        },
        outstanding: 34500,
        interest: 120033,
        principal: 30000,
        paymentGroups: [
          {
            contractNo: 'LC-00002',
            rows: [
              { installmentNo: 2, penalty: 120, tracking: 0, lawyer: 0, interest: 0, principal: 11000, total: 11120 },
              { installmentNo: 3, penalty: 0, tracking: 0, lawyer: 0, interest: 0, principal: 11600, total: 11600 }
            ]
          },
          {
            contractNo: 'LC-00547',
            rows: [
              { installmentNo: 2, penalty: 120, tracking: 0, lawyer: 0, interest: 0, principal: 11000, total: 11120 }
            ]
          }
        ]
      }
    } else {
      const response = await ReceiptService.getReceiptById(invoiceId.value)
      form.value = response.data
    }
  }
  return {
    form,
    fetchById
  }
}
