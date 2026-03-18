<template>
  <div>
    <BaseActionMenu :items="items" />
    <ModalHowDidFindUsAction
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
import type { IActionHowDidFindUsPayload } from '@/models/request/how-did-find-us/HowDidFindUsReq.model'
import type { IHowDidFindUsList } from '@/models/response/how-did-find-us/HowDidFindUsRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import BaseActionMenu, { type IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import ModalHowDidFindUsAction from './ModalHowDidFindUsAction.vue'

interface IProps {
  item: IHowDidFindUsList
}

interface IEmits {
  edit: [id: TBaseParamsId]
  delete: [id: TBaseParamsId]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const form = defineModel<IActionHowDidFindUsPayload>({ required: true })
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
