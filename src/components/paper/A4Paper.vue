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
		margin: 0;
	}
}
</style>
