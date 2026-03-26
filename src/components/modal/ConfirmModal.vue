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
      <div class="flex flex-col items-center justify-center text-sm text-[#333333] mb-5">
        <p v-sanitize.basic="description" />
      </div>
      <FormAction
        confirm-label="ยืนยัน"
        mode="submit"
        fluid
        @cancel="close()"
        @confirm="onConfirm(close)" />
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import FormAction from '../button/FormAction.vue'
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
