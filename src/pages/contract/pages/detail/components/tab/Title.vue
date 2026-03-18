<template>
  <BaseTop>
    <span class="text-sm font-bold text-font-gray">
      {{ title }}
    </span>
    <Spacer />
    <slot />
  </BaseTop>
</template>

<script setup lang="ts">
import BaseTop from '@/components/base/BaseTop.vue'
import Spacer from '@/components/flex/Spacer.vue'

interface IProps {
  title: string
}

defineProps<IProps>()
</script>

<style scoped>

</style>
