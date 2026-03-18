<template>
  <div>
    <BaseActionMenu :items="items" />
    <ModalExpenseCategoryAction
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
import type { IActionFinanceExpenseCategoryPayload } from '@/models/request/finance-expense-category/FinanceExpenseCategoryReq.model'
import type { IFinanceExpenseCategoryList } from '@/models/response/finance-expense-category/FinanceExpenseCategoryRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import ModalExpenseCategoryAction from './ModalExpenseCategoryAction.vue'

interface IProps {
  item: IFinanceExpenseCategoryList
}

interface IEmits {
  edit: [id: TBaseParamsId]
  delete: [id: TBaseParamsId]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const form = defineModel<IActionFinanceExpenseCategoryPayload>({ required: true })
const editModalVisible = ref<boolean>(false)

const items = ref<IMenuItemAction[]>([
  { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: (): void => { openEdit() } },
  { label: 'ลบ', key: 'delete', action: (): void => { emits('delete', props.item.id!) }, type: 'DELETE' }
])

function openEdit (): void {
  form.value = JSON.parse(JSON.stringify(props.item))
  editModalVisible.value = true
}

function onEdit (id: TBaseParamsId): void {
  emits('edit', id)
}

</script>

<style scoped></style>
