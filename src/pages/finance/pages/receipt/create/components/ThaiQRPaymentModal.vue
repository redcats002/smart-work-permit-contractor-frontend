<template>
  <Teleport to="body">
    <Transition name="qr-modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" />
        <!-- Modal Content -->
        <div class="relative z-10 bg-white rounded-xl shadow-xl flex flex-col items-center p-6 max-w-sm w-full mx-4">
          <!-- Thai QR Payment Card -->
          <div
            ref="qrCardRef"
            class="border-2 border-[#e0e0e0] rounded-xl overflow-hidden bg-white shadow-sm"
            style="width: 296px; height: 420px;">
            <div class="flex flex-col h-full">
              <!-- Main Logo: THAI QR PAYMENT -->
              <div
                class="flex justify-center items-center py-3"
                style="background-color: #00427A;">
                <div class="px-3 py-1.5 flex items-center gap-2">
                  <img
                    class="h-7"
                    src="/thai_qr_payment/logo_with_text.svg">
                </div>
              </div>

              <img
                class="mx-auto my-3 h-10"
                src="/thai_qr_payment/PromptPay-logo.png">

              <!-- QR Code Area -->
              <div class="flex-1 flex items-center justify-center">
                <div class="relative">
                  <div class="bg-white p-2 rounded-lg">
                    <img
                      v-if="qrImage"
                      :src="qrImage"
                      class="block"
                      style="width: 180px; height: 180px;">
                    <!-- Placeholder while loading -->
                    <div
                      v-else
                      class="flex items-center justify-center bg-gray-100 rounded"
                      style="width: 180px; height: 180px;">
                      <span class="text-xs text-gray-400">กำลังโหลด...</span>
                    </div>
                  </div>

                  <!-- Abbreviate Logo (center of QR) -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="flex items-center justify-center"
                      style="width: 44px; height: 44px;">
                      <div class="flex items-center justify-center p-1">
                        <img
                          class="mx-auto w-7 h-7"
                          src="/thai_qr_payment/logo.svg">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Expiry Time -->
          <div
            v-if="expiresAt"
            class="mt-4 text-center">
            <span class="text-sm text-gray-500">หมดอายุใน </span>
            <span class="text-sm font-semibold text-[#BD0102]">{{ expiryText }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 w-full mt-4">
            <button
              class="flex-1 px-4 py-2.5 bg-[#BD0102] text-white text-sm font-bold rounded-lg hover:bg-[#a00102] transition-colors"
              @click="onSaveQR()">
              บันทึก QR
            </button>
            <button
              class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
              @click="onCancel()">
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import html2canvas from 'html2canvas'

interface IProps {
  qrImage?: string
  trxId?: string
  expiresAt?: string
}

const props = withDefaults(defineProps<IProps>(), {
  qrImage: '',
  trxId: '',
  expiresAt: ''
})

const visible = defineModel<boolean>({ default: false })
const emit = defineEmits<{
  'save-qr': [image: string]
  'cancel': []
}>()

const qrCardRef = ref<HTMLElement | null>(null)
const remainingSeconds = ref<number>(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

const expiryText = computed((): string => {
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

function startTimer (): void {
  stopTimer()
  if (!props.expiresAt) {
    remainingSeconds.value = 0
    return
  }
  const expiryTime = new Date(props.expiresAt).getTime()
  const now = Date.now()
  remainingSeconds.value = Math.max(0, Math.floor((expiryTime - now) / 1000))

  if (remainingSeconds.value <= 0) return

  timerInterval = setInterval((): void => {
    remainingSeconds.value = Math.max(0, remainingSeconds.value - 1)
    if (remainingSeconds.value <= 0) {
      stopTimer()
      visible.value = false
      emit('cancel')
    }
  }, 1000)
}

function stopTimer (): void {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

async function onSaveQR (): Promise<void> {
  if (!props.qrImage || !qrCardRef.value) return

  const canvas = await html2canvas(qrCardRef.value, {
    useCORS: true,
    backgroundColor: '#ffffff',
    scale: 2
  })

  const dataUrl = canvas.toDataURL('image/png')
  emit('save-qr', dataUrl)

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `qr-payment-${props.trxId || Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function onCancel (): void {
  visible.value = false
  emit('cancel')
}

watch((): boolean => visible.value, (val: boolean): void => {
  if (val) {
    startTimer()
  } else {
    stopTimer()
  }
})

onUnmounted((): void => {
  stopTimer()
})
</script>

<style scoped>
.qr-modal-enter-active,
.qr-modal-leave-active {
  transition: opacity 0.2s ease;
}

.qr-modal-enter-active > div:last-child,
.qr-modal-leave-active > div:last-child {
  transition: transform 0.2s ease;
}

.qr-modal-enter-from,
.qr-modal-leave-to {
  opacity: 0;
}

.qr-modal-enter-from > div:last-child {
  transform: scale(0.95);
}

.qr-modal-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
