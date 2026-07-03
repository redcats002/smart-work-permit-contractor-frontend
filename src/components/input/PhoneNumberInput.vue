<template>
  <InputMask
    v-bind="$attrs"
    v-model="model"
    class="w-full h-9"
    mask="999-999-9999"
    placeholder="XXX-XXX-XXXX" />
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<style scoped>

</style>
