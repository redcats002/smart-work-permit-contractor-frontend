<template>
  <BaseModal
    v-model="visible"
    :label="title"
    class="md:w-fit!"
    @show="onShow()">
    <template #default="{ close }">
      <div class="flex flex-col gap-4 w-[439px]">
        <label class="flex flex-col gap-1">
          <span class="text-sm font-bold text-[#333333]">{{ label }}</span>
          <InputNumber
            v-model="amount"
            :max-fraction-digits="2"
            :min="0"
            :min-fraction-digits="2"
            class="w-full"
            locale="th-TH"
            fluid />
        </label>
        <FormAction
          confirm-label="ยืนยัน"
          mode="submit"
          @cancel="close()"
          @confirm="onConfirm(close)" />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import FormAction from '@/components/button/FormAction.vue'

interface IProps {
  title: string
  label: string
  initialAmount?: number
}

interface IEmits {
  confirm: [amount: number]
}

const props = withDefaults(defineProps<IProps>(), {
  initialAmount: 0
})
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>({ default: false })
const amount = ref<number | null>(null)

function onShow (): void {
  amount.value = props.initialAmount ?? 0
}

function onConfirm (close: () => void): void {
  emits('confirm', amount.value ?? 0)
  close()
}
</script>

<style scoped></style>
