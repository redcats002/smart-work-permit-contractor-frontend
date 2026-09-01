<template>
  <svg
    v-if="props.status === 'DRAFT'"
    aria-hidden="true"
    class="shrink-0"
    fill="none"
    height="10"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    viewBox="0 0 16 16"
    width="10"><path d="M11.5 2.5l2 2L5 13l-3 1 1-3z" /></svg>
  <svg
    v-else-if="props.status === 'CLOSED'"
    aria-hidden="true"
    class="shrink-0"
    fill="none"
    height="10"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    viewBox="0 0 16 16"
    width="10"><path d="M3 8.5l3 3 7-7" /></svg>
  <svg
    v-else-if="props.status === 'EXPIRED'"
    aria-hidden="true"
    class="shrink-0"
    fill="none"
    height="10"
    stroke="currentColor"
    stroke-linecap="round"
    viewBox="0 0 16 16"
    width="10"><line
      x1="8"
      x2="8"
      y1="3"
      y2="9.5" /><circle
        cx="8"
        cy="12.5"
        fill="currentColor"
        r="0.75"
        stroke="none" /></svg>
</template>

<script setup lang="ts">
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'

/**
 * wayfinder ticket 027 — DRAFT/CLOSED/EXPIRED are the neutral-family status trio whose fg/bg
 * pairs read as near-identical greys to a colour-blind viewer or on a greyscale printout, so
 * each gets a small non-colour leading glyph inside its chip in addition to the widened fg
 * weights (see the tailwind.css comments above --color-status-draft-fg). Renders nothing for
 * every other status — this app's other statuses already carry enough colour separation and
 * were not part of the ticket. Inline SVG, never <Icon>/@iconify/vue: this app runs Iconify in
 * API mode, so an Iconify icon is a runtime network fetch and must never sit behind a
 * safety-status indicator (wayfinder 041, out of scope here). `stroke="currentColor"` /
 * `fill="currentColor"` so the glyph always matches the chip's own fg token.
 */
interface IProps {
  status: TPermitStatus
}

const props = defineProps<IProps>()
</script>

<style scoped>

</style>
