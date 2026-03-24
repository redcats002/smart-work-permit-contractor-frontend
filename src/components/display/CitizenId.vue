<template>
  <span>{{ maskedValue }}</span>
  <Icon
    :icon="!visibleCitizenId ? 'famicons:eye-outline' : 'famicons:eye-off-outline'"
    class="cursor-pointer"
    color="#BD0102"
    @click="toggleVisibleCitizenId()" />
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
  const last4 = props.value?.slice(-4)
  // *-**-*
  const masked = `${last4?.[0]}-${last4?.[1]}${last4?.[2]}-${last4?.[3]}`
  if (!visibleCitizenId.value) return `*-****-****${masked}`
  return formatter.thaiCitizenId(props.value)
})

function toggleVisibleCitizenId (): void {
  visibleCitizenId.value = !visibleCitizenId.value
}

</script>

<style scoped>

</style>
