<template>
  <div
    :class="{
      'bg-shadow': shadow
    }"
    class="relative w-full bg-white rounded-md px-4 py-6 sm:p-3 md:p-5 lg:p-10">
    <div
      v-if="$slots.topright"
      class="absolute mb-4 grid gap-2 right-4 top-4">
      <slot name="topright" />
    </div>
    <slot />
  </div>
</template>
<script lang="ts" setup>
interface IProps {
  shadow?: boolean
}

withDefaults(defineProps<IProps>(), {
  shadow: true
})
</script>

<style  scoped>
.bg-shadow {
	border-radius: 8px;
	background: var(--wh, #fff);
	/* sh */
	box-shadow: 0 0 10px 4px rgba(16, 68, 212, 0.051);
}
</style>
