<template>
  <BaseModal
    v-model="visible"
    :label="label"
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
    <template #default="{close}">
      <div class="flex flex-col items-center justify-center text-sm text-(--color-text-strong) mb-5">
        <p v-sanitize.basic="description" />
      </div>
      <div class="flex gap-2.5 w-full justify-center">
        <ConfirmButton
          label="ยืนยัน"
          mode="submit"
          type="button"
          @click="onConfirm(close)" />
        <CancelButton @cancel="close()" />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import CancelButton from '../button/CancelButton.vue'
import ConfirmButton from '../button/ConfirmButton.vue'
import BaseModal from './BaseModal.vue'

interface IProps {
  label?: string
  description?: string
}
interface IEmits {
  confirm: []
}
withDefaults(defineProps<IProps>(), {
  label: 'ยืนยันการดำเนินการ',
  description: 'คุณแน่ใจหรือไม่ว่าต้องการดำเนินการต่อ<br/>หากยืนยันแล้วจะไม่สามารถย้อนกลับได้'
})
const emits = defineEmits<IEmits>()
const visible = defineModel<boolean>({ default: false })


function onConfirm (close: () => void): void {
  emits('confirm')
  close()
}

</script>

<style scoped>

</style>
