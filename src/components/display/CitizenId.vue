<template>
  <div class="flex items-center gap-1.5">
    <span>{{ maskedValue }}</span>
    <Icon
      :icon="!visibleCitizenId ? 'famicons:eye-outline' : 'famicons:eye-off-outline'"
      class="cursor-pointer"
      color="#BD0102"
      @click="toggleVisibleCitizenId()" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatter } from '@/utils/Formatter'
import { Icon } from '@iconify/vue'

interface IProps {
  value: string
}

const props = defineProps<IProps>()
const visibleCitizenId = defineModel<boolean>({
  default: false
})

const maskedValue = computed((): string => {
  const last3 = props.value?.slice(-3)
  const masked = `${last3?.[0]}${last3?.[1]}-${last3?.[2]}`
  if (!visibleCitizenId.value) return `X-XXXX-XXXXX-${masked}`
  return formatter.thaiCitizenId(props.value)
})

function toggleVisibleCitizenId (): void {
  visibleCitizenId.value = !visibleCitizenId.value
}

</script>

<style scoped>

</style>
