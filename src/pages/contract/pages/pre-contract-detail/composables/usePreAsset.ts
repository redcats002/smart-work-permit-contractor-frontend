import { ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { IUpdatePreAssetPayload } from '@/models/request/pre-contract/PreContractReq.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import PreContractProvider, { type IPreContractProvider } from '@/resources/provider/pre-contract/PreContract.provider'
import type { IMedia } from '@/resources/provider/Upload.provider'
import useUpload from '@/composables/useUpload'
import { useInitForm } from '../schema/pre-asset.schema'

interface IUsePreAsset {
  formPreAsset: Ref<IUpdatePreAssetPayload>
  onUpdatePreAsset (preAssetId: TBaseParamsId): void
}

export function usePreAsset (useFetch: () => Promise<void>): IUsePreAsset {
  const PreContractService: IPreContractProvider = new PreContractProvider()

  const { getUploadImages } = useUpload()
  const formPreAsset = ref<IUpdatePreAssetPayload>(useInitForm())

  async function usePayload (): Promise<IUpdatePreAssetPayload> {
    return {
      ...formPreAsset.value,
      images: await getUploadImages(formPreAsset.value.images as IMedia[])
    }
  }

  async function useUpdatePreAsset (preAssetId: TBaseParamsId): Promise<void> {
    const payload = await usePayload()
    await PreContractService.updatePreAsset(preAssetId, payload)
    toast.success('บันทึกข้อมูลหลักทรัพย์สำเร็จ')
    await useFetch()
  }

  function onUpdatePreAsset (preAssetId: TBaseParamsId): void {
    handleLoading((): Promise<void> => useUpdatePreAsset(preAssetId))
  }


  return {
    formPreAsset,
    onUpdatePreAsset
  }
}
