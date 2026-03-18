<template>
  <BaseModal
    v-model:visible="visible"
    class="md:w-fit!"
    header-align="center"
    label="ยืนยันการดำเนินการ"
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
        <p>
          คุณแน่ใจหรือไม่ว่าต้องการดำเนินการต่อ
        </p>
        <p>
          หากยืนยันแล้วจะไม่สามารถย้อนกลับได้
        </p>
      </div>
      <FormAction
        confirm-label="ยืนยัน"
        mode="submit"
        @cancel="close()"
        @confirm="onConfirm(close)" />
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import FormAction from '../button/FormAction.vue'
import BaseModal from './BaseModal.vue'

const visible = defineModel<boolean>({ default: false })

interface IEmits {
  confirm: []
}

const emits = defineEmits<IEmits>()

function onConfirm (close: () => void): void {
  emits('confirm')
  close()
}
</script>

<style scoped>

</style>
