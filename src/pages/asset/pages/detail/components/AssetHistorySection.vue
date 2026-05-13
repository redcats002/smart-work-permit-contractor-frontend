<template>
  <div class="rounded-xl bg-white">
    <div class="px-5 pt-4 pb-5">
      <BaseTab
        v-model="tab"
        :items="tabItems"
        full />
    </div>
    <div class="px-5 pb-8">
      <BaseTabWindow
        :items="tabItems"
        v-bind="props"
        :model-value="tab"
        @sell="emits('sell', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseTab from '@/components/base/BaseTab.vue'
import BaseTabWindow from '@/components/base/BaseTabWindow.vue'
import { useInitDetail } from '../composables/useInitDetail'

interface IProps {
  loanAmount: number
  salePrice: number | null
  saleDate: string | null
}

interface IEmits {
  sell: [salePrice: number]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const { tab, tabItems } = useInitDetail()

</script>
