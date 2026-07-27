import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import type { IBaseSuccessResponse } from '@/models/response/Response.model'
import { PaymentMethodEnum } from '@/enums/modules/contract/PaymentMethod.enum'
import { EPaymentSocketEvent } from '@/enums/modules/finance/PaymentSocketEvent.enum'
import useGateway from '@/resources/gateway/useGateway'
import ReceiptProvider, { type IReceiptProvider } from '@/resources/provider/receipt/Receipt.provider'
import type { TReceiptPaymentMethodLocal } from '@/pages/finance/components/shared/PaymentMethodSelector.vue'

export interface IQRPaymentResponse {
  qrImage?: string
  expired?: string
  trxId?: string
}

export interface IUseQRPaymentOptions {
  navigateTo?: string
}

interface IUseQRPayment {
  qrModalVisible: Ref<boolean>
  qrImage: Ref<string>
  qrTrxId: Ref<string>
  qrExpiresAt: Ref<string>
  mapPaymentType (paymentMethod: TReceiptPaymentMethodLocal): PaymentMethodEnum
  handleQRResponse(response: IQRPaymentResponse): void
  isQRResponse(data: unknown): data is IQRPaymentResponse
  handlePaymentResponse(response: IBaseSuccessResponse<unknown>): boolean
  checkReceiptReference(receiptRef: { id: number, qrImage: string, expired: string } | null | undefined): void
  cancelQrCode(customerId: number): Promise<void>
  onPaymentCallback(): void
  initGateway(): void
  destroyGateway(): void
}

const ReceiptService: IReceiptProvider = new ReceiptProvider()

export function useQRPayment (options: IUseQRPaymentOptions = {}): IUseQRPayment {
  const router = useRouter()
  const navigateTo = options.navigateTo ?? 'ReceiptListPage'

  const qrModalVisible = ref<boolean>(true) // Set to true to show the QR modal by default, can be changed based on your requirements
  const qrImage = ref<string>('')
  const qrTrxId = ref<string>('')
  const qrExpiresAt = ref<string>('')

  function handleQRResponse (response: IQRPaymentResponse): void {
    if (response.qrImage) {
      qrImage.value = response.qrImage
      qrTrxId.value = response.trxId ?? ''
      qrExpiresAt.value = response.expired ?? ''
      qrModalVisible.value = true
    }
  }

  function mapPaymentType (paymentMethod: TReceiptPaymentMethodLocal): PaymentMethodEnum {
    const paymentTypeMap: Record<TReceiptPaymentMethodLocal, PaymentMethodEnum> = {
      cash: PaymentMethodEnum.CASH,
      qr: PaymentMethodEnum.BANK_TRANSFER
    }
    return paymentTypeMap[paymentMethod as TReceiptPaymentMethodLocal] ?? PaymentMethodEnum.CASH
  }

  function isQRResponse (data: unknown): data is IQRPaymentResponse {
    return typeof data === 'object' && data !== null && 'qrImage' in data
  }

  function handlePaymentResponse (response: IBaseSuccessResponse<unknown>): boolean {
    if (isQRResponse(response.data)) {
      handleQRResponse(response.data)
      return true
    }
    return false
  }

  function checkReceiptReference (receiptRef: { id: number, qrImage: string, expired: string } | null | undefined): void {
    if (receiptRef?.qrImage && receiptRef.expired && new Date(receiptRef.expired).getTime() > Date.now()) {
      qrImage.value = receiptRef.qrImage
      qrTrxId.value = String(receiptRef.id)
      qrExpiresAt.value = receiptRef.expired
      qrModalVisible.value = true
    }
  }

  async function cancelQrCode (customerId: number): Promise<void> {
    await ReceiptService.cancelQrCode(customerId)
    qrImage.value = ''
    qrTrxId.value = ''
    qrExpiresAt.value = ''
  }

  function onPaymentCallback (): void {
    qrModalVisible.value = false
    qrImage.value = ''
    qrTrxId.value = ''
    qrExpiresAt.value = ''
    toast.success('ชำระเงินสำเร็จ')
    router.push({ name: navigateTo })
  }

  const paymentGateway = useGateway(EPaymentSocketEvent['callback-payment-qrcode'], onPaymentCallback)

  function initGateway (): void {
    paymentGateway.initWatcher()
  }

  function destroyGateway (): void {
    paymentGateway.destroyWatcher()
  }

  onMounted((): void => {
    initGateway()
  })

  onUnmounted((): void => {
    destroyGateway()
  })

  return {
    qrModalVisible,
    qrImage,
    qrTrxId,
    qrExpiresAt,
    mapPaymentType,
    handleQRResponse,
    isQRResponse,
    handlePaymentResponse,
    checkReceiptReference,
    cancelQrCode,
    onPaymentCallback,
    initGateway,
    destroyGateway
  }
}
