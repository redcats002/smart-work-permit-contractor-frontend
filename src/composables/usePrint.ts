import { onMounted, onUnmounted } from 'vue'
import useDev from './useDev'

export interface IUsePrint {
  onPrint (): Promise<void>

}

interface IProps {
  print?: boolean
  init?: () => Promise<void>
}

export default function usePrint (props?: IProps): IUsePrint {
  const { isDev } = useDev()

  function closePage (): void {
    if (window.opener) {
      window.close() // Close only if opened in a new tab
    }
  }

  async function onPrint (): Promise<void> {
    if (props?.init) await props.init()
    await document.fonts.ready // Ensure fonts are loaded

    if (!isDev.value) window.addEventListener('afterprint', closePage)
    // window.addEventListener('afterprint', closePage)

    setInterval((): void => {
      if (!isDev.value) window.print()
    }, 2000)
  }
  if (props?.print) {
    onMounted(async (): Promise<void> => {
      await onPrint()
    })

    onUnmounted((): void => {
      window.removeEventListener('afterprint', closePage)
    })
  }
  return {
    onPrint
  }
}
