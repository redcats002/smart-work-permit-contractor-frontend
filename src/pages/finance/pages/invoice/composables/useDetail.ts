import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IInvoiceDetail } from '@/models/response/invoice/InvoiceRes.model'
import { ETitleName } from '@/enums/TitleName.enum'
import InvoiceProvider, { type IInvoiceProvider } from '@/resources/provider/invoice/Invoice.provider'

interface IUseDetail {
  form: Ref<IInvoiceDetail>
  fetchById(): void
}

export default function useDetail (): IUseDetail {
  const invoiceService: IInvoiceProvider = new InvoiceProvider()
  const route = useRoute()
  const invoiceId = computed((): number => Number(route.params.id))

  const form = ref<IInvoiceDetail>({
    id: 0,
    contractId: null,
    invoiceNo: null,
    contractNo: null,
    dateOfPayment: null,
    dueDate: null,
    branch: null,
    customer: {
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
    items: []
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
        invoiceNo: 'INV-00001',
        contractNo: 'LC-00001',
        dateOfPayment: '2012-04-23T18:25:43.511Z',
        dueDate: '2012-04-23T18:25:43.511Z',
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
            amount: 1,
            price: 11500
          },
          {
            detail: 'ดอกเบี้ย',
            amount: 4,
            price: 1500
          },
          {
            detail: 'ค่าติดตาม',
            amount: 10,
            price: 10000
          }
        ]
      }
    } else {
      const response = await invoiceService.getInvoiceById(invoiceId.value)
      form.value = response.data
    }
  }
  return {
    form,
    fetchById
  }
}
