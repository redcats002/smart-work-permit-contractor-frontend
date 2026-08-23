<template>
  <div
    v-if="matrix"
    class="rounded-xl border border-border bg-surface-card p-5 text-center">
    <p class="mb-3 text-[12.5px] font-semibold tracking-wide text-text-secondary uppercase">
      {{ t('permit.detail.qr.title') }}
    </p>
    <div
      class="mx-auto flex size-43 items-center justify-center rounded-lg border border-border bg-white p-2.5"
      data-test="qr-code">
      <svg
        :aria-label="t('permit.detail.qr.alt')"
        :viewBox="`0 0 ${matrix.size} ${matrix.size}`"
        class="size-full"
        role="img"
        shape-rendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg">
        <rect
          :height="matrix.size"
          :width="matrix.size"
          fill="#ffffff"
          x="0"
          y="0" />
        <rect
          v-for="module in matrix.dark"
          :key="`${module.x}-${module.y}`"
          :x="module.x"
          :y="module.y"
          fill="#000000"
          height="1"
          width="1" />
      </svg>
    </div>
    <p class="mt-3 font-mono text-[11px] text-text-tertiary">
      {{ t('permit.detail.qr.hint') }}
    </p>
    <p class="mt-1 text-[11px] font-semibold text-status-active-fg">
      ● {{ t('permit.detail.qr.live') }}
    </p>
  </div>

  <div
    v-else
    class="rounded-xl border border-dashed border-border-strong bg-surface-dashed px-5 py-6 text-center"
    data-test="qr-pending">
    <p
      aria-hidden="true"
      class="mb-2 text-[34px] opacity-40">
      ⧗
    </p>
    <p class="text-[13px] font-semibold text-text-secondary">
      {{ t('permit.detail.qr.pending.title') }}
    </p>
    <p class="mt-1.5 text-xs leading-relaxed text-text-tertiary">
      {{ t('permit.detail.qr.pending.description') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import QRCode from 'qrcode'

interface IProps {
  /** Signed token from GET /permits/:id/qr. `null` for every status that has no QR yet. */
  token: string | null
}

interface IQrModule {
  x: number
  y: number
}

interface IQrMatrix {
  size: number
  dark: IQrModule[]
}

const props = defineProps<IProps>()

const { t } = useI18n()

/**
 * `qrcode` is already a dependency (PMT-010 notes) — nothing new is installed here.
 *
 * `QRCode.create()` gives the raw module matrix, which is rendered as plain `<rect>` elements.
 * The `toCanvas`/`toDataURL` helpers go through a canvas the test environment (jsdom) does not
 * implement, and `toString({ type: 'svg' })` would have to be injected as raw markup.
 */
const matrix: ComputedRef<IQrMatrix | null> = computed((): IQrMatrix | null => {
  if (!props.token) return null
  try {
    const code = QRCode.create(props.token, { errorCorrectionLevel: 'M' })
    const size = code.modules.size
    const dark: IQrModule[] = []
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (code.modules.data[y * size + x]) dark.push({ x, y })
      }
    }
    return { size, dark }
  } catch (error: unknown) {
    console.error('[PermitQrPanel] QR render failed', error)
    return null
  }
})
</script>

<style scoped>

</style>
