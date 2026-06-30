<template>
  <div class="flex gap-3 items-center w-full flex-wrap sm:flex-nowrap">
    <button
      :class="modelValue === 'cash' ? 'border-2 border-[#bd0102]' : 'border border-[#bdbdbd]'"
      class="bg-white rounded-lg shadow-[1px_1px_2px_rgba(51,51,51,0.25)] flex-1 min-w-[160px] p-4 cursor-pointer flex flex-col items-center"
      type="button"
      @click="emits('update:modelValue', 'cash')">
      <div class="flex items-center gap-1">
        <div
          :class="modelValue === 'cash' ? 'border-[#bd0102]' : 'border-[#bdbdbd]'"
          class="size-4 rounded-full border-2 flex items-center justify-center shrink-0">
          <div
            v-if="modelValue === 'cash'"
            class="size-2 rounded-full bg-[#bd0102]" />
        </div>
        <span class="text-base text-[#333]">เงินสด</span>
      </div>
    </button>

    <button
      :class="modelValue === 'qr' ? 'border-2 border-[#bd0102]' : 'border border-[#bdbdbd]'"
      class="bg-white rounded-lg shadow-[1px_1px_2px_rgba(51,51,51,0.25)] flex-1 min-w-[160px] p-4 cursor-pointer flex flex-col items-center"
      type="button"
      @click="emits('update:modelValue', 'qr')">
      <div class="flex items-center gap-1">
        <div
          :class="modelValue === 'qr' ? 'border-[#bd0102]' : 'border-[#bdbdbd]'"
          class="size-4 rounded-full border-2 flex items-center justify-center shrink-0">
          <div
            v-if="modelValue === 'qr'"
            class="size-2 rounded-full bg-[#bd0102]" />
        </div>
        <span class="text-base text-[#333]">QR Code PromptPay</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
export type TPaymentMethod = 'cash' | 'qr'

interface IProps {
  modelValue: TPaymentMethod
}

interface IEmits {
  'update:modelValue': [value: TPaymentMethod]
}

defineProps<IProps>()
const emits = defineEmits<IEmits>()
</script>
