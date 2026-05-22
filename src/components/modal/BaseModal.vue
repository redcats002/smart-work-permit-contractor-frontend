<template>
  <Dialog
    v-bind="$attrs"
    v-model:visible="visible"
    :dismissable-mask="dismissableMask"
    class="md:w-220 w-9/10"
    modal
    @hide="close()"
    @show="open()">
    <template #container="{ closeCallback }">
      <div class="bg-white rounded-lg w-full max-h-[80vh] flex flex-col overflow-hidden">
        <div
          :class="headerAlign === 'center'
            ? 'flex justify-center'
            : 'flex items-center justify-between'"
          class="px-8 pt-10 mb-5 relative">
          <label
            :class="headerAlign === 'center' ? 'text-center' : ''"
            class="text-lg font-bold text-[#333333]">
            {{ label }}
          </label>
          <div
            :class="{
              'absolute right-4 top-4': headerAlign === 'center'
            }"
            class="flex gap-2.5 items-center">
            <slot name="menu" />
            <Icon
              class="cursor-pointer size-6 text-[#62748E] hover:text-black transition-all duration-200"
              icon="mdi:close"
              @click="closeCallback()" />
          </div>
        </div>
        <div class="px-8 pb-10 overflow-y-auto flex-1">
          <slot
            :close="close"
            :open="open" />
        </div>
        <div
          v-if="$slots.footer"
          class="px-8 pb-10 pt-4 border-t overflow-hidden border-surface-100 bg-white">
          <slot
            :close="close"
            :open="open"
            :visible="visible"
            name="footer" />
        </div>
      </div>
    </template>
  </Dialog>
  <slot
    v-if="$slots.activator"
    :close="close"
    :open="open"
    :visible="visible"
    name="activator" />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineOptions({ inheritAttrs: false })

interface IProps {
  label?: string
  headerAlign?: 'left' | 'center'
  dismissableMask?: boolean
}

interface IEmits {
  'open': [value: boolean]
  'close': [value: boolean]
  'update:model-value': [value: boolean]
}

withDefaults(defineProps<IProps>(), {
  label: '',
  headerAlign: 'left',
  dismissableMask: true
})
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>({ default: false })


function open (): void {
  visible.value = true
  emits('open', true)
}

function close (): void {
  visible.value = false
  emits('close', false)
}

// function onUpdateModelValue (value: boolean): void {
//   console.log('update:model-value', value)
//   emits('update:model-value', value)
//   if (value) {
//     emits('open', value)
//   } else {
//     emits('close', value)
//   }
// }

defineExpose({
  open,
  close
})
</script>
