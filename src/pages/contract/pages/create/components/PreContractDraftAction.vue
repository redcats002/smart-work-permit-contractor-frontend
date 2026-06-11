<template>
  <div class="flex gap-3 flex-wrap">
    <ConfirmModal @confirm="handleConfirmSubmit()">
      <template #activator="{open}">
        <ConfirmButton
          class="bg-primary! text-white! w-full md:w-49.5"
          label="ยืนยัน/สั่งงานประเมิน"
          type="button"
          @click="open()" />
      </template>
    </ConfirmModal>
    <Button
      class="bg-white! text-[#333333]! border-gray-400! flex items-center hover:bg-gray-100! w-full md:w-49.5"
      label="ร่าง"
      type="submit"
      outlined
      @click="emits('setSubmitMode','DRAFT')" />
    <ConfirmModal
      label="ยกเลิกการประเมินหลักทรัพย์?"
      @confirm="emits('cancel')">
      <template #activator="{open}">
        <Button
          class="w-full md:w-49.5"
          label="ยกเลิก"
          outlined
          @click="open()" />
      </template>
    </ConfirmModal>

    <button
      ref="submitBtnRef"
      class="hidden"
      type="submit" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import ConfirmModal from '@/components/modal/ConfirmModal.vue'

interface IEmits {
  setSubmitMode: [mode: TPreContractStatus]
  cancel: []
}

const emits = defineEmits<IEmits>()

const submitBtnRef = ref<HTMLButtonElement>()

function handleConfirmSubmit (): void {
  emits('setSubmitMode', 'PENDING_EVALUATION')
  submitBtnRef.value?.click()
}
</script>

<style scoped>

</style>
