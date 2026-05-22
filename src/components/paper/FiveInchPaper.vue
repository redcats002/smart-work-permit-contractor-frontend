<template>
  <section
    :class="{ 'outline outline-1 outline-dashed outline-gray-300': isDev }"
    class="paper-five-inch">
    <slot />
  </section>
</template>

<script setup lang="ts">
import useDev from '@/composables/useDev'

const { isDev } = useDev()
</script>

<style scoped lang="scss">
$width: 90mm;
$height: 140mm;

.paper-five-inch {
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
		size: $width $height;
		margin: 0;
	}
}
</style>
