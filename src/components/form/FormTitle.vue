<template>
  <div>
    <p class="text-xl font-bold text-font-gray">
      {{ label }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  label: string
}

defineProps<IProps>()
</script>

<style scoped>

</style>
