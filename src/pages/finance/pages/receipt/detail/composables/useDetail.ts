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
    customer: {
      id: 0,
      idCard: '',
      titleName: ETitleName[''],
      firstName: '',
      lastName: ''
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
    principal: null
  })
  function fetchById (): void {
    handleLoading(useFetchById)
  }

  async function useFetchById (): Promise<void> {
    const isNoApi = true
    if (isNoApi) {
      form.value = {
        id: 0,
        contractId: null,
        receiptNo: 'RCPT-00001',
        contractNo: 'LC-00001',
        dateOfPayment: '2012-04-23T18:25:43.511Z',
        branch: 'ขอนแก่น',
        customer: {
          id: 0,
          idCard: '1-2345-67890-12-3',
          titleName: ETitleName.MR,
          firstName: 'จันทร์',
          lastName: 'ทองเพิ่มเกรียม'
        },
        address: 'อาคารเลขที่ 128 ถนนพญาไท',
        subDistrict: 'แขวงถนนพญาไท',
        district: 'เขตราชเทวี',
        province: 'กรุงเทพมหานคร',
        postCode: '10400',
        totalValue: 23000,
        items: [
          {
            detail: 'เงินต้น งวดที่ 6/12',
            price: 11500
          },
          {
            detail: 'ดอกเบี้ย',
            price: 1500
          },
          {
            detail: 'ค่าติดตาม',
            price: 10000
          }
        ],
        officer: {
          id: 0,
          idCard: '1-2345-67890-12-3',
          titleName: ETitleName.MR,
          firstName: 'จันทร์',
          lastName: 'ทองเพิ่มเกรียม'
        },
        outstanding: 34500,
        interest: 120033,
        principal: 30000
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
