<template>
  <Button
    v-bind="$attrs"
    class="bg-[#FFF6E5]! border-none!"
    @click="copy(props.value)">
    <Icon
      color="#FFAE23"
      icon="lucide-copy" />
  </Button>
</template>

<script setup lang="ts">
import { useCopy } from '@/composables/useCopy'
import { Icon } from '@iconify/vue'

interface IProps {
  value: string
}

const props = defineProps<IProps>()

const { copy } = useCopy()

</script>

<style scoped>

</style>
