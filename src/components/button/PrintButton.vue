<template>
  <Button
    :as="to ? RouterLink : 'button'"
    :class="{
      'h-10 w-10': !label
    }"
    :to="to"
    class="flex items-center rounded-sm"
    outlined>
    <div
      v-if="label"
      class="text-sm font-medium">
      {{ label }}
    </div>
  </Button>
</template>

<script setup lang="ts">
import { type RouteLocationRaw, RouterLink } from 'vue-router'

interface IProps {
  label?: string
  to?: RouteLocationRaw
}
withDefaults(defineProps<IProps>(), {
  label: 'พิมพ์เอกสาร',
  to: undefined
})
</script>

<style scoped>

</style>
