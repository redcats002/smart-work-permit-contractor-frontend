<template>
  <div>
    <BaseActionMenu :items="items" />
    <ModalIncomeCategoryAction
      v-if="item.id"
      :id="item.id"
      v-model="form"
      v-model:visible="editModalVisible"
      :type="'EDIT'"
      @edit="onEdit($event)" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IActionFinanceIncomeCategoryPayload } from '@/models/request/finance-income-type/FinanceIncomeTypeReq.model'
import type { IFinanceIncomeCategoryList } from '@/models/response/finance-income-category/FinanceIncomeCategoryRes.model'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import ModalIncomeCategoryAction from './ModalIncomeCategoryAction.vue'

interface IProps {
  item: IFinanceIncomeCategoryList
}

interface IEmits {
  edit: [id: number]
  delete: [id: number]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const form = defineModel<IActionFinanceIncomeCategoryPayload>({ required: true })
const editModalVisible = ref<boolean>(false)

const items = ref<IMenuItemAction[]>([
  { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: (): void => { openEdit() } },
  { label: 'ลบ', key: 'delete', action: (): void => { emits('delete', props.item.id!) }, type: 'DELETE' }
])

function openEdit (): void {
  form.value = JSON.parse(JSON.stringify(props.item))
  editModalVisible.value = true
}

function onEdit (id: number): void {
  emits('edit', id)
}

</script>

<style scoped></style>
