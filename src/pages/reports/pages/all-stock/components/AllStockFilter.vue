<template>
  <BaseTop>
    <div class="flex justify-center items-center gap-4">
      <!-- <div>
        ประจำเดือน
        <span v-if="!isFilterable">
          {{ dayjs().format('MMMM') }}
        </span>
      </div> -->
      <div v-if="isFilterable">
        <DatePickerInput
          v-model="model"
          date-format="mm/yy"
          placeholder="เลือกเดือน"
          view="month"
          @update:model-value="onSearch()" />
      </div>
    </div>
    <Spacer />
    <div>
      <slot />
    </div>
  </BaseTop>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IAllStockFilter } from '@/models/modules/report/all-stock/Filter.model'
import BaseTop from '@/components/base/BaseTop.vue'
import Spacer from '@/components/flex/Spacer.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'

interface IEmits {
  search: []
  modalSearch: []
  clear: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<string>({ default: '' })
defineModel<IAllStockFilter>('filters', { default: (): IAllStockFilter => ({}) })


const isFilterable = ref<boolean>(false)

function onSearch (): void {
  emits('search')
}

</script>

<style scoped>

</style>
