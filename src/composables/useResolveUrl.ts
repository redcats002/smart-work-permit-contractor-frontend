import UploadProvider, {
  type IFileUrl,
  type IUploadProvider
} from '@/resources/provider/Upload.provider'

interface IUseResolveUrl {
  isResolvedImageUrl: (value?: string | null) => boolean
  resolveUploadImageUrl: (value?: string | null, fallback?: string) => Promise<IFileUrl>
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

  async function resolveUploadImageUrl (value?: string | null, fallback: string = ''): Promise<IFileUrl> {
    const normalizedValue = value?.trim() || ''
    if (!normalizedValue) return { url: fallback }
    if (isResolvedImageUrl(normalizedValue)) return { url: normalizedValue }

    try {
      const response = await UploadService.getFileUrl(normalizedValue)
      return { url: response?.data?.url ?? fallback }
    } catch (error) {
      console.error('Failed to resolve upload image url', error)
      return { url: fallback }
    }
  }

  return {
    isResolvedImageUrl,
    resolveUploadImageUrl
  }
}
