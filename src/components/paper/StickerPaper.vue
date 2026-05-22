<template>
  <section
    :class="{ 'outline outline-1 outline-dashed outline-gray-300': isDev }"
    class="paper-sticker">
    <slot />
  </section>
</template>

<script setup lang="ts">
import useDev from '@/composables/useDev'

const { isDev } = useDev()
</script>

<style scoped lang="scss">
$width: 80mm;
$height: 50mm;

.paper-sticker {
	width: $width;
	min-height: $height;
	max-height: $height;
	background: white;
	box-sizing: border-box;
	overflow: hidden;
	print-color-adjust: exact;
	-webkit-print-color-adjust: exact;
}

@media screen {
	.paper-sticker {
		margin: 0 auto;
	}
}

@media print {
	html,
	body {
		margin: 0;
		padding: 0;
		width: $width;
		height: $height;
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
	}

	.print-hidden {
		display: none !important;
	}

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
		size: $width $height;
		margin: 0;
	}
}
</style>
