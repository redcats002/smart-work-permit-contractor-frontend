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
        <div class="flex flex-col gap-5">
          <LabelField
            v-slot="{ invalid }"
            :form="{}"
            label="ช่วงเวลา"
            name="period"
            tag="div">
            <Select
              v-model="filterModel.period"
              :invalid="invalid"
              :options="periodOptions"
              name="period"
              option-label="label"
              option-value="value"
              placeholder="เลือกช่วงเวลา"
              show-clear />
          </LabelField>
          <LabelField
            v-model="filterModel.date"
            :form="{}"
            label="วันที่"
            name="date" />
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
import { ref } from 'vue'
import type { IBranchHeadSummaryFilter } from '@/models/modules/report/branch-head-summary/Filter.model'
import { EReportPeriod } from '@/models/request/leader-branch-report/LeaderBranchReportReq.model'
import BaseTop from '@/components/base/BaseTop.vue'
import FilterButton from '@/components/button/FilterButton.vue'
import FormActionFilter from '@/components/button/FormActionFilter.vue'
import Spacer from '@/components/flex/Spacer.vue'
import LabelField from '@/components/input/LabelField.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import Select from '@/volt/Select.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>({ default: '' })
const filterModel = defineModel<IBranchHeadSummaryFilter>('filters', { default: (): IBranchHeadSummaryFilter => ({}) })

const periodOptions = ref([
  { label: 'รายวัน', value: EReportPeriod.DAY },
  { label: 'รายเดือน', value: EReportPeriod.MONTH },
  { label: 'รายปี', value: EReportPeriod.YEAR }
])

function onSearch (): void {
  emits('search')
}

function onModalSearch (close: () => void): void {
  emits('search')
  emits('modalSearch')
  close()
}

function onClear (close: () => void): void {
  filterModel.value = {}
  emits('clear')
  close()
}
</script>

<style scoped></style>
