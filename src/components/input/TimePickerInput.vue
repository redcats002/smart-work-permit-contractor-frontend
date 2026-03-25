<template>
  <div class="w-full">
    <button
      :class="[
        'h-9 w-full rounded-sm border border-surface-300 bg-surface-0 px-3 text-sm flex items-center gap-2',
        'disabled:cursor-not-allowed disabled:bg-surface-100 disabled:text-surface-400',
        'hover:border-surface-400 focus:border-primary'
      ]"
      :disabled="disabled"
      type="button"
      @click="onToggle($event)">
      <Icon
        class="text-surface-500"
        icon="material-symbols:schedule-outline" />
      <span class="truncate text-left">
        {{ displayValue || placeholder }}
      </span>
    </button>
    <div class="relative">
      <span class="absolute text-primary text-sm">{{ validationMessage }}</span>
    </div>

    <Menu
      ref="menuRef"
      :model="[]"
      popup>
      <template #start>
        <div class="p-3 min-w-72">
          <div
            v-if="useStartEndRange"
            class="grid grid-cols-2 gap-3">
            <div class="text-xs text-surface-500">
              <span class="mb-1 block">เริ่ม</span>
              <div class="rounded-sm border border-surface-300 p-2">
                <div class="flex items-center justify-center gap-2">
                  <div class="flex flex-col items-center">
                    <button
                      class="rounded p-1 hover:bg-surface-100"
                      type="button"
                      @click="shiftPart('start', 'hours', 1)">
                      <Icon icon="mdi:chevron-up" />
                    </button>
                    <span class="w-8 text-center text-base text-surface-700">{{ startHours }}</span>
                    <button
                      class="rounded p-1 hover:bg-surface-100"
                      type="button"
                      @click="shiftPart('start', 'hours', -1)">
                      <Icon icon="mdi:chevron-down" />
                    </button>
                  </div>
                  <span class="text-surface-500">:</span>
                  <div class="flex flex-col items-center">
                    <button
                      class="rounded p-1 hover:bg-surface-100"
                      type="button"
                      @click="shiftPart('start', 'minutes', 1)">
                      <Icon icon="mdi:chevron-up" />
                    </button>
                    <span class="w-8 text-center text-base text-surface-700">{{ startMinutes }}</span>
                    <button
                      class="rounded p-1 hover:bg-surface-100"
                      type="button"
                      @click="shiftPart('start', 'minutes', -1)">
                      <Icon icon="mdi:chevron-down" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-xs text-surface-500">
              <span class="mb-1 block">สิ้นสุด</span>
              <div class="rounded-sm border border-surface-300 p-2">
                <div class="flex items-center justify-center gap-2">
                  <div class="flex flex-col items-center">
                    <button
                      class="rounded p-1 hover:bg-surface-100"
                      type="button"
                      @click="shiftPart('end', 'hours', 1)">
                      <Icon icon="mdi:chevron-up" />
                    </button>
                    <span class="w-8 text-center text-base text-surface-700">{{ endHours }}</span>
                    <button
                      class="rounded p-1 hover:bg-surface-100"
                      type="button"
                      @click="shiftPart('end', 'hours', -1)">
                      <Icon icon="mdi:chevron-down" />
                    </button>
                  </div>
                  <span class="text-surface-500">:</span>
                  <div class="flex flex-col items-center">
                    <button
                      class="rounded p-1 hover:bg-surface-100"
                      type="button"
                      @click="shiftPart('end', 'minutes', 1)">
                      <Icon icon="mdi:chevron-up" />
                    </button>
                    <span class="w-8 text-center text-base text-surface-700">{{ endMinutes }}</span>
                    <button
                      class="rounded p-1 hover:bg-surface-100"
                      type="button"
                      @click="shiftPart('end', 'minutes', -1)">
                      <Icon icon="mdi:chevron-down" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="text-xs text-surface-500 block">
            <span class="mb-1 block">เวลา</span>
            <div class="rounded-sm border border-surface-300 p-2">
              <div class="flex items-center justify-center gap-2">
                <div class="flex flex-col items-center">
                  <button
                    class="rounded p-1 hover:bg-surface-100"
                    type="button"
                    @click="shiftPart('single', 'hours', 1)">
                    <Icon icon="mdi:chevron-up" />
                  </button>
                  <span class="w-8 text-center text-base text-surface-700">{{ singleHours }}</span>
                  <button
                    class="rounded p-1 hover:bg-surface-100"
                    type="button"
                    @click="shiftPart('single', 'hours', -1)">
                    <Icon icon="mdi:chevron-down" />
                  </button>
                </div>
                <span class="text-surface-500">:</span>
                <div class="flex flex-col items-center">
                  <button
                    class="rounded p-1 hover:bg-surface-100"
                    type="button"
                    @click="shiftPart('single', 'minutes', 1)">
                    <Icon icon="mdi:chevron-up" />
                  </button>
                  <span class="w-8 text-center text-base text-surface-700">{{ singleMinutes }}</span>
                  <button
                    class="rounded p-1 hover:bg-surface-100"
                    type="button"
                    @click="shiftPart('single', 'minutes', -1)">
                    <Icon icon="mdi:chevron-down" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import Menu from '@/volt/Menu.vue'
import { Icon } from '@iconify/vue'

defineOptions({
  inheritAttrs: false
})

interface IProps {
  range?: boolean
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  placeholder: 'เลือกเวลา',
  disabled: false,
  range: false
})

const model = defineModel<string | null | undefined>()
const startModel = defineModel<string | null | undefined>('start')
const endModel = defineModel<string | null | undefined>('end')

const attrs = useAttrs()
const timeRegex = new RegExp('^(\\d{1,2}):(\\d{2})$')
const menuRef = ref<{ toggle: (event: Event) => void } | null>(null)

const placeholder = computed((): string => props.placeholder)
const disabled = computed((): boolean => props.disabled)

const useStartEndRange = computed((): boolean => {
  return props.range || ('onUpdate:start' in attrs && 'onUpdate:end' in attrs)
})

const validationMessage = computed((): string => {
  if (useStartEndRange.value) {
    const start = startModel.value
    const end = endModel.value

    if (!start || !end) {
      const msg = 'กรุณาระบุเวลาเปิดและเวลาปิดร้านให้ครบถ้วน'
      return msg
    }

    const startVal = splitTimeParts(start)
    const endVal = splitTimeParts(end)
    const startTotal = startVal.hours * 60 + startVal.minutes
    const endTotal = endVal.hours * 60 + endVal.minutes

    if (startTotal >= endTotal) {
      const msg = 'เวลาเปิดต้องน้อยกว่าเวลาปิดร้าน'
      return msg
    }
  } else {
    if (!model.value) {
      return 'กรุณาระบุเวลา'
    }
  }

  return ''
})

function normalizeTime24 (value: string | null | undefined): string | null {
  if (!value) return null

  const time = value.trim()
  const matches = timeRegex.exec(time)
  if (!matches) return null

  const hours = Number(matches[1])
  const minutes = Number(matches[2])

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function onToggle (event: Event): void {
  if (disabled.value) return
  menuRef.value?.toggle(event)
}

function splitTimeParts (value: string | null | undefined): { hours: number, minutes: number } {
  const normalized = normalizeTime24(value) || '00:00'
  const [hoursText, minutesText] = normalized.split(':')
  return {
    hours: Number(hoursText),
    minutes: Number(minutesText)
  }
}

function toTimeString (hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function shiftPart (
  target: 'single' | 'start' | 'end',
  part: 'hours' | 'minutes',
  step: number
): void {
  const currentValue = target === 'single'
    ? model.value
    : target === 'start'
      ? startModel.value
      : endModel.value

  const parts = splitTimeParts(currentValue)

  if (part === 'hours') {
    parts.hours = (parts.hours + step + 24) % 24
  } else {
    parts.minutes = (parts.minutes + step + 60) % 60
  }

  const nextValue = toTimeString(parts.hours, parts.minutes)

  if (target === 'single') model.value = nextValue
  if (target === 'start') startModel.value = nextValue
  if (target === 'end') endModel.value = nextValue
}

const singleHours = computed((): string => String(splitTimeParts(model.value).hours).padStart(2, '0'))
const singleMinutes = computed((): string => String(splitTimeParts(model.value).minutes).padStart(2, '0'))
const startHours = computed((): string => String(splitTimeParts(startModel.value).hours).padStart(2, '0'))
const startMinutes = computed((): string => String(splitTimeParts(startModel.value).minutes).padStart(2, '0'))
const endHours = computed((): string => String(splitTimeParts(endModel.value).hours).padStart(2, '0'))
const endMinutes = computed((): string => String(splitTimeParts(endModel.value).minutes).padStart(2, '0'))

const displayValue = computed((): string => {
  if (useStartEndRange.value) {
    const start = normalizeTime24(startModel.value)
    const end = normalizeTime24(endModel.value)

    if (start && end) return `${start}-${end}`
    if (start) return start
    if (end) return end
    return ''
  }

  return normalizeTime24(model.value) || ''
})
</script>

<style scoped>

</style>
