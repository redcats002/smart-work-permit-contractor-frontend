<template>
  <div class="grid grid-cols-1 gap-2.5">
    <DisplayList
      :items="items"
      row-class="md:grid-cols-8"
      value-class="md:col-span-7" />
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
    { key: 'detail', label: 'รายละเอียดเพิ่มเติม', value: `โลเล็ม อิปซัม (lorem ipsum) — เป็นข้อความแทนที่ (placeholder text) ใช้เพื่อลดความสนใจต่อข้อความที่นำมาแสดง สำหรับการแสดงลักษณะของ ฟอนต์ การพิมพ์และการจัดหน้า ข้อความโลเร็ม อิปซัมเป็นข้อความส่วนหนึ่งในภาษาละตินที่แต่งโดย ซิเซโร โดยมีการตัดต่อคำให้ดูเหมือนเป็นข้อความที่ไม่มีความหมายและไม่ใช่ภาษาละตินที่ถูกต้องในออกแบบต่างๆ ถ้าข้อความสามารถอ่านได้ ผู้ดูจะสนใจข้อความจนไม่สนใจ การจัดหน้าและรูปแบบ ดังนั้นผู้ออกแบบจึงควรใช้ข้อความโลเร็ม อิปซัมเพื่อให้ผู้ดูสนใจที่การออกแบบไม่ใช่ข้อความ` }
  ]
})

</script>

<style scoped>

</style>
