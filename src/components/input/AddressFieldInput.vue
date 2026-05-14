<template>
  <div
    class="relative w-full"
    @keydown.enter.prevent.stop>
    <AutoCompleteInput
      v-bind="attrs"
      :dropdown="false"
      :invalid="invalid"
      :model-value="displayValue"
      :option-label="mapTitleText"
      :suggestions="addressData"
      unstyled
      @complete="onSearch($event)"
      @item-select="onItemSelect($event)"
      @update:model-value="onUpdateModelValue($event)">
      <template #option="{ option }">
        <div class="px-3 py-2">
          {{ mapTitleText(option) }}
        </div>
      </template>
    </AutoCompleteInput>
    <InputText
      v-if="name"
      ref="proxyInput"
      v-model="displayValue"
      :name="name"
      class="absolute w-0 h-0 opacity-0 overflow-hidden pointer-events-none p-0 m-0 border-0"
      tabindex="-1"
      type="text" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, useAttrs, watch } from 'vue'
import {
  getEngMode,
  searchAddressByDistrict,
  searchAddressByPostalCode,
  searchAddressByProvince,
  searchAddressBySubDistrict,
  setEngMode
} from 'thai-address-universal'
import AutoCompleteInput from './AutoCompleteInput.vue'

/* ================= types ================= */

export interface IAddressData {
  subDistrict: string
  district: string
  province: string
  postalCode: string
}

/* ================= props / emits ================= */

interface IProps {
  modelValue?: string
  addressType: 'sub-district' | 'district' | 'province' | 'zipcode'
  engMode?: boolean
  invalid?: boolean
  name?: string
}

interface IEmits {
  (e: 'update:model-value', value: string): void
  (e: 'select', value: IAddressData): void
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  engMode: false,
  name: ''
})
const emits = defineEmits<IEmits>()
const attrs = useAttrs()

/* ================= state ================= */

const displayValue = ref<any>(props.modelValue ?? '')
const addressData = ref<any[]>([])
const proxyInput = ref<any>(null)

/* ================= engMode ================= */

onMounted(async (): Promise<void> => {
  setTimeout(async (): Promise<void> => {
    if (getEngMode() !== props.engMode) await setEngMode(props.engMode)
  }, 500)
})

watch((): boolean => props.engMode, async (val: boolean): Promise<void> => {
  if (getEngMode() !== val) {
    await setEngMode(val)
  }
})

/* ================= watch: sync from parent ================= */

watch(
  (): any => props.modelValue, (val: any): void => {
    if (val !== getDisplayString(displayValue.value)) {
      displayValue.value = val ?? ''
    }
  }
)

// Force trigger input event on proxy input when value changes programmatically
watch(
  (): any => displayValue.value, async (): Promise<void> => {
    if (props.name && proxyInput.value) {
      await nextTick()
      // Fix: Target the proxy input directly, don't search in parent (which finds AutoComplete input)
      const inputEl = proxyInput.value.$el
      if (inputEl) {
        // Dispatch 'input' makes Form validation update
        inputEl.dispatchEvent(new Event('input', { bubbles: true }))
        // Dispatch 'change' just in case
        inputEl.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }
  }
)

/* ================= search ================= */

async function onSearch (event: { query: string }): Promise<void> {
  const keyword = event.query?.trim()
  if (!keyword) {
    addressData.value = []
    return
  }

  // Set engMode before each search to handle multiple instances
  await setEngMode(props.engMode)

  switch (props.addressType) {
    case 'sub-district':
      addressData.value = await searchAddressBySubDistrict(keyword)
      break
    case 'district':
      addressData.value = await searchAddressByDistrict(keyword)
      break
    case 'province':
      addressData.value = await searchAddressByProvince(keyword)
      break
    case 'zipcode':
      addressData.value = await searchAddressByPostalCode(keyword)
      break
    default:
      addressData.value = []
  }
}


function mapTitleText (raw: any): string {
  if (!raw) return ''
  if (typeof raw === 'string') return raw
  return `${raw.sub_district} » ${raw.district} » ${raw.province} » ${raw.postal_code}`
}


function getDisplayString (val: any): string {
  if (!val || typeof val === 'string') return val || ''

  switch (props.addressType) {
    case 'sub-district':
      return val.sub_district || ''
    case 'district':
      return val.district || ''
    case 'province':
      return val.province || ''
    case 'zipcode':
      return String(val.postal_code || '')
    default:
      return ''
  }
}


function formatAddressData (val: any): IAddressData {
  return {
    subDistrict: val.sub_district,
    district: val.district,
    province: val.province,
    postalCode: val.postal_code
  }
}

function onUpdateModelValue (val: any): void {
  // If val is object (from selection), convert to string immediately
  const displayStr = getDisplayString(val)
  displayValue.value = displayStr
  emits('update:model-value', displayStr)
}

/* ================= item select (auto-fill) ================= */

function onItemSelect (event: { value: any }): void {
  const val = event.value
  if (!val || typeof val === 'string') return

  const formatData = formatAddressData(val)
  const displayStr = getDisplayString(val)

  // Update local state and emit
  displayValue.value = displayStr
  emits('update:model-value', displayStr)
  emits('select', formatData)
}
</script>
