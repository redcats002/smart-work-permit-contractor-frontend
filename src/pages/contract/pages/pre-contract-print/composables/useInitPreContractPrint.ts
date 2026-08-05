import { ref, type Ref } from 'vue'
import type { IPreContractById } from '@/models/response/pre-contract/PreContractRes.model'
import type { IBorrowerList } from '@/models/modules/pre-contract/Borrower.model'
import type { IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import PreContractProvider from '@/resources/provider/pre-contract/PreContract.provider'
import { useDayjs } from '@/utils/Dayjs'
import type { ILoanAgreementDocument } from '@/pages/contract/components/print/LoanAgreementDocument.vue'

interface IUseInitPreContractPrint {
  doc: Ref<ILoanAgreementDocument | null>
  fetch: () => Promise<void>
}

const PreContractService: IPreContractProvider = new PreContractProvider()
const dayjs = useDayjs()

export function useInitPreContractPrint (id: number, branchName: string): IUseInitPreContractPrint {
  const doc = ref<ILoanAgreementDocument | null>(null)

  async function fetch (): Promise<void> {
    const res = await PreContractService.getContractFindOne(id)
    const data: IPreContractById = res.data

    const contracted = dayjs(data.contractedAt)

    doc.value = {
      branchName,
      contractedAt: data.contractedAt,
      loanAmount: data.loanAmount,
      annualInterestRate: data.annualInterestRate,
      assets: data.preAssets,
      firstInstallmentDate: contracted.add(1, 'month').format('YYYY-MM-DD'),
      finalInstallmentDate: contracted.add(data.installmentCount, 'month').format('YYYY-MM-DD'),
      borrowers: data.borrowers.map(
        (b: IBorrowerList): ILoanAgreementDocument['borrowers'][number] => ({
          id: b.customer.id,
          fullName: b.customer.fullName,
          idCard: b.customer.idCard,
          birthDate: b.customer.birthDate,
          mainAddress: b.customer.mainAddress
        })
      )
    }
  }

  return { doc, fetch }
}
