<template>
  <div class="flex gap-3 flex-wrap">
    <ConfirmButton
      label="ยืนยัน/สั่งงานประเมิน"
      type="submit"
      @click="emits('setSubmitMode','PENDING_EVALUATION')" />
    <Button
      class="bg-white! text-[#333333]! border-gray-400! flex items-center hover:bg-gray-100! w-full md:w-49.5"
      label="ร่าง"
      type="submit"
      outlined
      @click="emits('setSubmitMode','DRAFT')" />
    <Button
      class="w-full md:w-49.5"
      label="ยกเลิก"
      outlined
      @click="emits('cancel')" />
  </div>
</template>

<script setup lang="ts">
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import ConfirmButton from '@/components/button/ConfirmButton.vue'

interface IEmits {
  setSubmitMode: [mode: TPreContractStatus]
  cancel: []
}

const emits = defineEmits<IEmits>()

</script>

<style scoped>

</style>
