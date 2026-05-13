<template>
  <div
    :class="{
      'mx-auto max-w-6xl': responsive
    }"
    class="pt-4">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface IProps {
  responsive?: boolean
}

withDefaults(defineProps<IProps>(), {
  responsive: false
})
</script>

<style scoped>

</style>
