<template>
  <Button
    :as="to ? RouterLink : 'button'"
    :class="{
      'bg-white! text-[#333333]! border-[#E2E8F0]! flex items-center hover:bg-gray-100!': theme === 'secondary',
    }"
    :to="to"
    class="w-full h-10.5 md:w-49.5
    disabled:bg-white! disabled:border-(--p-gray-5)! disabled:text-(--p-gray-5)!"
    data-testid="cancel-button"
    type="button"
    unstyled
    @click="onClick($event)">
    <div class="text-sm font-medium">
      ยกเลิก
    </div>
  </Button>
</template>

<script setup lang="ts">
import { type RouteLocationRaw, RouterLink } from 'vue-router'

interface IProps {
  to?: RouteLocationRaw
  theme?: 'primary' | 'secondary'
}

interface IEmits {
  cancel: []
}

const props = withDefaults(defineProps<IProps>(), {
  to: undefined,
  theme: 'secondary'
})

const emit = defineEmits<IEmits>()

function onClick (e: MouseEvent): void {
  if (!props.to) {
    e.preventDefault()
    emit('cancel')
  }
}
</script>
