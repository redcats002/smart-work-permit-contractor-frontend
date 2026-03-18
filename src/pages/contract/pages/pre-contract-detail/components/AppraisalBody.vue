<template>
  <div class="grid grid-cols-1 gap-2.5">
    <DisplayList :items="items" />
    <AppraisalTable
      v-model:pagination="pagination"
      :count="count"
      :evaluator-level="appraisal.evaluatorLevel"
      :items="appraisal.evaluators" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IEvaluateGroupList } from '@/models/modules/pre-contract/Evaluator.model'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import { useLocalPagination } from '@/composables/usePagination'
import AppraisalTable from './AppraisalTable.vue'

interface IProps {
  count: number
  appraisal: IEvaluateGroupList
}

const props = defineProps<IProps>()

const { pagination } = useLocalPagination(props.appraisal.evaluators)


const items = computed((): IDisplayList[] => {
  return [
    { key: 'detail', label: 'รายละเอียดเพิ่มเติม', value: props.appraisal?.detail || '-' }
  ]
})

</script>

<style scoped>

</style>
