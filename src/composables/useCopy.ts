import { ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'

interface IUseCopy {
  isCopied: Ref<boolean>
  copy: (text: string) => Promise<void>
}

export function useCopy (): IUseCopy {
  const isCopied = ref<boolean>(false)

  async function copy (text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`Copied "${text}" to clipboard`)
      isCopied.value = true
      setTimeout((): void => {
        isCopied.value = false
      }, 2000)
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  return {
    isCopied,
    copy
  }
}
