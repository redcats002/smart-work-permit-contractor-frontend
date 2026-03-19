import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import type { IInvoiceDetail, IInvoiceInstallment } from '@/models/response/invoice/InvoiceRes.model'
import { ETitleName } from '@/enums/TitleName.enum'
import InvoiceProvider, { type IInvoiceProvider } from '@/resources/provider/invoice/Invoice.provider'

interface IUseDetail {
  form: Ref<IInvoiceDetail>
  installmentForm: Ref<IInvoiceInstallment>
  fetchById(): void
}

export default function useDetail (): IUseDetail {
  const InvoiceService: IInvoiceProvider = new InvoiceProvider()
  const route = useRoute()
  const invoiceId = computed((): number => Number(route.params.id))

  const form = ref<IInvoiceDetail>({
    id: 0,
    idNo: '',
    contractInstallment: {
      id: 0,
      dueDate: ''
    },
    contract: {
      id: 0,
      idNo: '',
      customer: {
        id: 0,
        idCard: '',
        titleName: ETitleName[''],
        firstName: '',
        lastName: '',
        mainAddress: {
          address: 'หลัก',
          subDistrict: 'สายไหม',
          district: 'สายไหม',
          province: 'กรุงเทพมหานคร',
          postCode: '10220'
        }
      }
    },
    totalAmount: 0,
    items: []
  })

  const installmentForm = ref<IInvoiceInstallment>({
    contractInstallment: {
      id: 0,
      dueDate: 'string'
    },
    contract: {
      id: 0,
      idNo: 'string',
      customer: {
        id: 0,
        idNo: '',
        idCard: '',
        firstName: '',
        lastName: '',
        fullName: '',
        mainAddress: {
          address: '',
          subDistrict: '',
          district: '',
          province: '',
          postCode: ''
        }
      },
      branch: {
        id: '',
        taxId: '',
        name: '',
        address: '',
        subDistrict: '',
        district: '',
        province: '',
        postCode: '',
        logo: null
      }
    },
    items: []
  })

  function fetchById (): void {
    handleLoading(useFetchById)
  }

  async function useFetchById (): Promise<void> {
    const response = await InvoiceService.getInvoiceById(invoiceId.value)
    form.value = response.data

    useFetchInstallmentById(response.data.contractInstallment.id)
  }

  async function useFetchInstallmentById (installmentId: number): Promise<void> {
    const response = await InvoiceService.getInvoiceInstallmentById(installmentId)
    installmentForm.value = response.data
  }

  return {
    form,
    installmentForm,
    fetchById
  }
}
