<template>
  <Button
    :as="to ? RouterLink : 'button'"
    :class="{
      'h-10 w-10': !label
    }"
    :to="to"
    class="flex items-center rounded-sm w-full md:w-fit"
    outlined>
    <Icon
      :icon="icon"
      class="size-5" />
    <div
      v-if="label"
      class="text-sm font-medium">
      {{ label }}
    </div>
  </Button>
</template>

<script setup lang="ts">
import { type RouteLocationRaw, RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

interface IProps {
  label?: string
  to?: RouteLocationRaw
  icon?: string
}
withDefaults(defineProps<IProps>(), {
  label: '',
  to: undefined,
  icon: 'mdi:plus'
})
</script>

<style scoped>

</style>
