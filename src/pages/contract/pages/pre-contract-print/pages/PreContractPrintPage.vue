<template>
  <div>
    <div class="fixed bottom-6 right-6 z-50 print:hidden">
      <Button
        @click="onPrint()">
        <Icon icon="solar:printer-2-bold" /> <span>พิมพ์</span>
      </Button>
    </div>
    <A4Paper>
      <div class="bg-white">
        <LoanAgreementDocument
          v-if="doc"
          :doc="doc" />
      </div>
    </A4Paper>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/Auth'
import A4Paper from '@/components/paper/A4Paper.vue'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useInitPreContractPrint } from '../composables/useInitPreContractPrint'
import LoanAgreementDocument from '@/pages/contract/components/print/LoanAgreementDocument.vue'

const route = useRoute()
const { branch } = storeToRefs(useAuthStore())

const contractId = computed((): number => Number((route.params.id as string) ?? ''))
const { doc, fetch } = useInitPreContractPrint(contractId.value, branch.value.name)

function onPrint (): void {
  window.print()
}

onMounted(async (): Promise<void> => {
  await fetch()
  onPrint()
})
</script>
