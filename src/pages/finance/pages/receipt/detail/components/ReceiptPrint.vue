<template>
  <div>
    <div
      v-if="isDev"
      class="no-print mb-4 flex items-center gap-2 justify-end">
      <span class="text-sm text-gray-500">Receipt Mode:</span>
      <button
        :class="[isLite ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700']"
        class="px-3 py-1 rounded text-sm transition-colors"
        @click="isLite = true">
        Lite
      </button>
      <button
        :class="[!isLite ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700']"
        class="px-3 py-1 rounded text-sm transition-colors"
        @click="isLite = false">
        Full
      </button>
    </div>
    <ReceiptPrintLite
      v-if="isLite"
      :form="props.form" />
    <ReceiptPrintFull
      v-else
      :form="props.form" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useDev from '@/composables/useDev'
import type { IReceiptById } from '@/models/response/receipt/ReceiptRes.model'
import ReceiptPrintLite from './ReceiptPrintLite.vue'
import ReceiptPrintFull from './ReceiptPrintFull.vue'

interface IProps {
  form: IReceiptById
}

const props = defineProps<IProps>()
const { isDev } = useDev()
const isLite = ref<boolean>(true)
</script>

<style scoped>
</style>
