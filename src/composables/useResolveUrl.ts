import UploadProvider, {
  type IFileUrlResponse,
  type IUploadProvider
} from '@/resources/provider/Upload.provider'

interface IUseResolveUrl {
  isResolvedImageUrl: (value?: string | null) => boolean
  resolveUploadImageUrl: (value?: string | null, fallback?: string) => Promise<IFileUrlResponse>
}

export default function useResolveUrl (): IUseResolveUrl {
  const UploadService: IUploadProvider = new UploadProvider()

  function isResolvedImageUrl (value?: string | null): boolean {
    const normalizedValue = value?.trim() || ''
    if (!normalizedValue) return false

    return (
      (/^https?:\/\//i).test(normalizedValue)
      || normalizedValue.startsWith('/')
      || normalizedValue.startsWith('data:image/')
      || normalizedValue.startsWith('blob:')
    )
  }

  async function resolveUploadImageUrl (value?: string | null, fallback: string = ''): Promise<IFileUrlResponse> {
    const normalizedValue = value?.trim() || ''
    if (!normalizedValue) return {
      message: 'No value provided',
      url: fallback
    }
    if (isResolvedImageUrl(normalizedValue)) return {
      message: 'URL is already resolved',
      url: normalizedValue
    }

    try {
      return await UploadService.getFileUrl(normalizedValue) || { message: 'Failed to resolve URL', url: fallback }
    } catch (error) {
      console.error('Failed to resolve upload image url', error)
      return {
        message: 'Error occurred while resolving URL',
        url: fallback
      }
    }
  }

  return {
    isResolvedImageUrl,
    resolveUploadImageUrl
  }
}
