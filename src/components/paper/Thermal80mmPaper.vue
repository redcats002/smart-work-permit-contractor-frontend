<template>
  <section
    :class="{ 'outline outline-1 outline-dashed outline-gray-300': isDev }"
    class="paper-thermal-80mm">
    <slot />
  </section>
</template>

<script setup lang="ts">
import useDev from '@/composables/useDev'

const { isDev } = useDev()
</script>

<style scoped lang="scss">
$width: 72.1mm;
$font-size: 10px;
$line-height: 1.5;

.paper-thermal-80mm {
	width: $width;
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

	:deep(*) {
		font-size: $font-size;
		line-height: $line-height;
		color: #000;
		-webkit-font-smoothing: none;
		text-rendering: geometricPrecision;
	}

	:deep(h1) { font-size: 18px !important; }
	:deep(h2) { font-size: 16px !important; }
	:deep(h3) { font-size: 14px !important; }

	:deep(img),
	:deep(svg),
	:deep(canvas) {
		image-rendering: crisp-edges;
		image-rendering: -webkit-optimize-contrast;
	}

	:deep(table),
	:deep(th),
	:deep(td),
	:deep(tr) {
		border-color: #000;
	}

	@page {
		size: $width auto;
		margin: 0;
	}
}
</style>
