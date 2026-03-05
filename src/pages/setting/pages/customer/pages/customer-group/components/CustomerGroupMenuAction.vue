<template>
  <div>
    <BaseActionMenu :items="items" />
    <ModalCustomerGroupAction
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
import type { IActionCustomerGroupPayload } from '@/models/request/customer-group/CustomerGroupReq.model'
import type { ICustomerGroupList } from '@/models/response/customer-group/CustomerGroupRes.model'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import ModalCustomerGroupAction from './ModalCustomerGroupAction.vue'

interface IProps {
  item: ICustomerGroupList
}

interface IEmits {
  edit: [id: number]
  delete: [id: number]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const form = defineModel<IActionCustomerGroupPayload>({ required: true })
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
