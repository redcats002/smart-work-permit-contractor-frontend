<template>
  <BaseModal
    v-model="visible"
    :label="title"
    class="md:w-fit!"
    header-align="center"
    modal>
    <template #activator="{ open, close }">
      <slot
        :close="close"
        :open="open"
        :visible="visible"
        name="activator" />
    </template>
    <div class="flex flex-col items-center justify-center text-sm text-(--color-text-strong) mb-5">
      <p>
        {{ description1 }}
      </p>
      <p>
        {{ description2 }}
      </p>
    </div>
    <div class="flex gap-2.5 w-full">
      <ConfirmButton
        :label="confirmLabel"
        mode="delete"
        type="button"
        fluid
        @click="onConfirm()" />
      <CancelButton
        fluid
        @click="visible = false" />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import CancelButton from '../button/CancelButton.vue'
import ConfirmButton from '../button/ConfirmButton.vue'
import BaseModal from './BaseModal.vue'

export interface IDeleteModalProps {
  title?: string
  description1?: string
  description2?: string
  confirmLabel?: string
}

interface IProps extends IDeleteModalProps {}
interface IEmits {
  confirm: []
}

withDefaults(defineProps<IProps>(), {
  title: 'คุณต้องการลบ ?',
  description1: 'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้',
  description2: 'หากลบแล้ว ข้อมูลนี้จะถูกลบอย่างถาวรไม่สามารถย้อนกลับได้',
  confirmLabel: 'ใช่, ฉันต้องการลบ'
})
const emits = defineEmits<IEmits>()
const visible = defineModel<boolean>({ default: false })

function onConfirm (): void {
  emits('confirm')
  visible.value = false
}


</script>

<style scoped>

</style>
