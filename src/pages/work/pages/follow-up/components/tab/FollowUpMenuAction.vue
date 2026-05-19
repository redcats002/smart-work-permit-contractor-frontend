<template>
  <BaseActionMenu :items="items" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import WorkProvider, { type IWorkProvider } from '@/resources/provider/work/Work.provider'
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'

interface IProps {
  debtCollectionId: number
  contractId: number
}

interface IEmits {
  defer: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const router = useRouter()
const WorkService: IWorkProvider = new WorkProvider()

async function onDefer (): Promise<void> {
  await WorkService.deferDebtCollection(props.debtCollectionId)
  emits('defer')
}

const items = ref<IMenuItemAction[]>([
  {
    label: 'ชำระเงิน',
    key: 'payment',
    type: 'TEXT',
    action: (): void => {
      router.push({ name: 'ReceiptCreatePage', query: { contractId: props.contractId } })
    }
  },
  {
    label: 'ผ่อนผัน',
    key: 'defer',
    type: 'CONFIRM',
    action: (): void => {
      handleLoading(onDefer)
    }
  }
])
</script>

<style scoped></style>
