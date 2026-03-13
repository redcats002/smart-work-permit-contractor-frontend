<template>
  <BaseTop>
    <div>
      <SearchInput
        v-model="model"
        @search="onSearch()" />
    </div>
    <div>
      <BaseModal
        class="md:w-100!"
        label="ตัวกรอง">
        <template #activator="{ open }">
          <FilterButton @click="open()" />
        </template>
        <template #default>
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-surface-700 mb-2">หมวดหมู่</label>
              <SelectInput
                v-model="filters.category"
                :options="categoryOptions"
                option-label="label"
                option-value="value"
                placeholder="ทั้งหมด" />
            </div>
            <div>
              <label class="block text-sm font-medium text-surface-700 mb-2">สถานะ</label>
              <SelectInput
                v-model="filters.status"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                placeholder="ทั้งหมด" />
            </div>
          </div>
        </template>
        <template #footer="{ close }">
          <div class="flex items-center gap-4">
            <Button
              class="bg-[#C00000]! hover:bg-[#a30000]! text-white! flex items-center justify-center rounded-md! h-10.5 min-w-28 px-6"
              @click="onModalSearch(close)">
              <span class="text-sm font-medium">ยืนยัน</span>
            </Button>
            <Button
              class="bg-white! text-[#333333]! border-[#333333]! flex items-center justify-center rounded-md! h-10.5 min-w-28 px-6"
              @click="onClear(close)">
              <span class="text-sm font-medium">ล้างค่า</span>
            </Button>
          </div>
        </template>
      </BaseModal>
    </div>
    <Spacer />
    <div>
      <slot />
    </div>
  </BaseTop>
</template>

<script setup lang="ts">
import type { IAssetFilter } from '@/models/modules/asset/Filter.model'
import type { IBaseOption } from '@/models/Global.model'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import Spacer from '@/components/flex/Spacer.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>('search', { default: '' })
const filters = defineModel<IAssetFilter>('filters', { default: (): IAssetFilter => ({}) })

const categoryOptions: IBaseOption[] = [
  { label: 'ทั้งหมด', value: null },
  { label: 'อสังหาริมทรัพย์ - ที่ดิน', value: 'อสังหาริมทรัพย์ - ที่ดิน' },
  { label: 'อสังหาริมทรัพย์ - บ้าน', value: 'อสังหาริมทรัพย์ - บ้าน' },
  { label: 'อสังหาริมทรัพย์ - ห้องชุด', value: 'อสังหาริมทรัพย์ - ห้องชุด' },
  { label: 'ยานพาหนะ', value: 'ยานพาหนะ' },
  { label: 'เครื่องมือการเกษตร', value: 'เครื่องมือการเกษตร' }
]

const statusOptions: IBaseOption[] = [
  { label: 'ทั้งหมด', value: null },
  { label: 'รอขาย', value: 'WAITING' },
  { label: 'ใช้งาน', value: 'IN_USE' },
  { label: 'ขายแล้ว', value: 'SOLD' }
]

function onSearch (): void {
  emits('search')
}

function onModalSearch (close: () => void): void {
  emits('search')
  emits('modalSearch')
  close()
}

function onClear (close: () => void): void {
  filters.value = {}
  emits('search')
  emits('clear')
  close()
}
</script>

<style scoped>

</style>
