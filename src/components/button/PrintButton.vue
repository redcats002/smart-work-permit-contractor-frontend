<template>
  <Button
    v-if="show"
    :as="to ? RouterLink : 'button'"
    :class="{
      'h-9 w-9 p-0 justify-center': !label,
      'gap-2 px-3 h-9': label && icon
    }"
    :to="to"
    class="flex items-center rounded-sm"
    outlined>
    <Icon
      v-if="icon"
      :icon="icon"
      class="text-xl" />
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
  icon?: string
  to?: RouteLocationRaw
  show?: boolean
}
withDefaults(defineProps<IProps>(), {
  label: 'พิมพ์เอกสาร',
  icon: undefined,
  to: undefined,
  show: true
})
</script>

<style scoped>

</style>
