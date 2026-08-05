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
        <div class="space-y-4">
          <div>
            <LabelField
              v-if="tab==='NewWork'"
              label="สถานะ">
              <PreContractStatusSelection
                v-model="filters.status"
                placeholder="ทั้งหมด"
                show-clear />
            </LabelField>
          </div>
          <div>
            <LabelField label="หมวดหมู่สถานะ">
              <AssetTypeSelection
                v-model="filters.type"
                placeholder="ทั้งหมด"
                show-clear />
            </LabelField>
          </div>
        </div>
        <template #footer="{ close }">
          <FormActionFilter
            @clear="onClear(close)"
            @search="onModalSearch(close)" />
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
import type { IWorkAppraisalFilter } from '@/models/modules/work/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import Spacer from '@/components/flex/Spacer.vue'
import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import AssetTypeSelection from '@/components/selection/modules/static/asset-type/AssetTypeSelection.vue'
import PreContractStatusSelection from '@/components/selection/modules/static/pre-contract-status/PreContractStatusSelection.vue'
import type { TAssetAppraisalTab } from '../composables/useInit'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

interface IProps {
  tab?: TAssetAppraisalTab
}

const emits = defineEmits<IEmits>()
withDefaults(defineProps<IProps>(), {
  tab: undefined
})

const model = defineModel<string>('search', { default: '' })
const filters = defineModel<IWorkAppraisalFilter>('filters', {
  default: (): IWorkAppraisalFilter => ({})
})

function onSearch (): void {
  emits('search')
}

function onModalSearch (close: () => void): void {
  emits('search')
  emits('modalSearch')
  close()
}

function onClear (close: () => void): void {
  emits('search')
  emits('clear')
  close()
}

</script>

<style scoped>

</style>
