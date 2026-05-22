<template>
  <BaseModal
    v-model="visible"
    :label="title"
    class="md:w-fit!"
    header-align="center"
    modal>
    <div class="flex flex-col items-center justify-center text-sm text-[#333333] mb-5">
      <p>
        {{ description1 }}
      </p>
      <p>
        {{ description2 }}
      </p>
    </div>
    <FormAction
      :confirm-label="confirmLabel"
      mode="delete"
      fluid
      @cancel="visible = false"
      @confirm="emits('confirm')" />
  </BaseModal>
</template>

<script setup lang="ts">
import FormAction from '../button/FormAction.vue'
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


</script>

<style scoped>

</style>
