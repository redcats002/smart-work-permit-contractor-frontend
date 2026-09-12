<template>
  <section
    :class="{ 'outline outline-dashed outline-gray-300': isDev }"
    class="paper-a4">
    <slot />
  </section>
</template>

<script setup lang="ts">
import useDev from '@/composables/useDev'

const { isDev } = useDev()
</script>

<style scoped lang="scss">
$width: 210mm;
$height: 297mm;

.paper-a4 {
	width: $width;
	min-height: $height;
	background: white;
	box-sizing: border-box;
	print-color-adjust: exact;
	-webkit-print-color-adjust: exact;
}

@media print {
	html,
	body {
		margin: 0;
		padding: 0;
		width: $width;
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
	}

	.print-hidden {
		display: none !important;
	}

	@page {
		size: A4;
		// margin: 0;
		@top-center {
			content: '';
		}
		// 2026-09-12 owner-filed issue 2 (permit full-print/export). CSS Paged Media margin-box
		// `content` is not rendered by Chromium/Firefox print today, so this is a best-effort
		// fallback only for an engine that does support it — the mechanism the ticket names, kept
		// deliberately generic/static (no per-permit data, which margin boxes cannot carry
		// dynamically from Vue anyway). The page's ACTUAL header/footer — brand mark, permit id,
		// printed-at timestamp — is a `position: fixed` block inside the printed content itself
		// (see PermitPrintLayout.vue), which does repeat per page in the browsers this app targets.
		@bottom-center {
			content: counter(page) ' / ' counter(pages);
			font-size: 10px;
		}
	}
}
</style>
