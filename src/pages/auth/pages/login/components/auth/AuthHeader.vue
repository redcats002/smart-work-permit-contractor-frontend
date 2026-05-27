<template>
  <div class="flex flex-col justify-center items-center gap-4">
    <h1 class="text-2xl sm:text-3xl font-bold text-center text-primary">
      {{ title }}
    </h1>
    <img
      alt="mittae-siam-logo"
      class="object-contain w-36 sm:w-48"
      src="/assets/images/logo.png">
    <p
      v-if="description"
      class="text-center mt-2 text-font-gray">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  title: string
  description?: string
}

withDefaults(defineProps<IProps>(), {
  description: ''
})
</script>

<style scoped>

</style>
