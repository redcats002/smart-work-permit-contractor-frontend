import { ref, type Ref } from 'vue'
import type { IContractAssetList, IContractById } from '@/models/response/contract/ContractRes.model'
import type { IContractProvider } from '@/resources/provider/contract/Contract.provider'
import ContractProvider from '@/resources/provider/contract/Contract.provider'

interface IUseInitPrint {
  contract: Ref<IContractById | null>
  assets: Ref<IContractAssetList[]>
  fetch: () => Promise<void>
}

const ContractService: IContractProvider = new ContractProvider()

export function useInitPrint (id: number): IUseInitPrint {
  const contract = ref<IContractById | null>(null)
  const assets = ref<IContractAssetList[]>([])

  async function fetch (): Promise<void> {
    const [contractRes, assetRes] = await Promise.all([
      ContractService.getContractFindOne(id),
      ContractService.getContractAssets(id)
    ])
    contract.value = contractRes.data
    assets.value = assetRes.data
  }

  return { contract, assets, fetch }
}
