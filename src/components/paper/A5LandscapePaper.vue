<template>
  <section
    :class="{ 'outline outline-1 outline-dashed outline-gray-300': isDev }"
    class="paper-a5-landscape">
    <slot />
  </section>
</template>

<script setup lang="ts">
import useDev from '@/composables/useDev'

const { isDev } = useDev()
</script>

<style scoped lang="scss">
// A5 Landscape: 210mm wide × 148mm tall
$width: 210mm;
$height: 148mm;

.paper-a5-landscape {
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
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
	}

	.print-hidden {
		display: none !important;
	}

	@page {
		size: A5 landscape;
		margin: 0;
	}
}
</style>
