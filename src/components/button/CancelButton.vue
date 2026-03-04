<template>
  <Button
    :as="to ? RouterLink : 'button'"
    :to="to"
    class="bg-white! text-[#333333]! border-[#E2E8F0]! flex items-center hover:bg-gray-100! w-49.5"
    type="button"
    unstyled
    @click="onClick($event)">
    <div class="text-sm font-medium">
      ยกเลิก
    </div>
  </Button>
</template>

<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

interface IProps {
  to?: RouteLocationRaw
}

interface IEmits {
  cancel: []
}

const props = defineProps<IProps>()

const emit = defineEmits<IEmits>()

function onClick (e: MouseEvent): void {
  if (!props.to) {
    e.preventDefault()
    emit('cancel')
  }
}
</script>
