<template>
  <div class="rounded-xl border border-border bg-surface-card p-5 text-center">
    <p class="mb-3 text-[12.5px] font-semibold tracking-wide text-text-secondary uppercase">
      {{ t('worker.detail.qr.title') }}
    </p>

    <div
      v-if="matrix"
      class="mx-auto flex size-43 items-center justify-center rounded-lg border border-border bg-white p-2.5"
      data-test="worker-qr-code">
      <svg
        :aria-label="t('worker.detail.qr.alt')"
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

    <!--
      wayfinder 062: "show a QR code and the worker's id/name clearly enough that a field
      inspector can scan/read it off a phone screen". The id is rendered as plain, large
      monospace text alongside the QR itself — a scan failure (bad lighting, a cracked screen)
      must still let an inspector type the id in by hand, not dead-end at an unreadable code.
    -->
    <p class="mt-3 text-[15px] font-semibold text-text-primary">
      {{ worker.name }}
    </p>
    <p
      class="mt-1 font-mono text-lg font-bold tracking-wide text-text-primary"
      data-test="worker-qr-id">
      #{{ worker.id }}
    </p>
    <p class="mt-2 text-[11px] text-text-tertiary">
      {{ t('worker.detail.qr.hint') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import QRCode from 'qrcode'
import type { IWorker } from '@/models/modules/worker/Worker.model'

/**
 * wayfinder 062 — "the QR encodes the worker id; the exact payload string is recorded in the
 * resolution." The payload is the bare numeric id as a string and NOTHING else (no prefix, no
 * JSON envelope) — ticket 065's entrant scanner must parse the identical string.
 *
 * `qrcode` is already a dependency (059 ruling 9 / package.json:36) — nothing new installed.
 * Rendered as raw `<rect>` elements from `QRCode.create()`'s module matrix, same approach as
 * `PermitQrPanel.vue`: `toCanvas`/`toDataURL` need a canvas jsdom does not implement.
 */
interface IProps {
  worker: IWorker
}

const props = defineProps<IProps>()

const { t } = useI18n()

interface IQrModule {
  x: number
  y: number
}

interface IQrMatrix {
  size: number
  dark: IQrModule[]
}

const matrix: ComputedRef<IQrMatrix | null> = computed((): IQrMatrix | null => {
  try {
    const code = QRCode.create(String(props.worker.id), { errorCorrectionLevel: 'M' })
    const size = code.modules.size
    const dark: IQrModule[] = []
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (code.modules.data[y * size + x]) dark.push({ x, y })
      }
    }
    return { size, dark }
  } catch (error: unknown) {
    console.error('[WorkerQrCard] QR render failed', error)
    return null
  }
})
</script>

<style scoped></style>
