<template>
  <BaseContainer>
    <DisplayList :items="items" />
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import type { IDailySummaryDetailList } from '@/models/response/report/daily-summary/DailySummaryDetailRes'

interface IProps {
  data?: IDailySummaryDetailList
}

const props = withDefaults(defineProps<IProps>(), {
  data: (): IDailySummaryDetailList => ({
    id: 0,
    branch: '-',
    invoiceNo: '-',
    date: '',
    createdBy: {
      id: 0,
      firstName: '-',
      lastName: '-'
    },
    items: []
  } as unknown as IDailySummaryDetailList)
})

const dayjs = useDayjs()

const items = computed((): IDisplayList[] => {
  return [
    { label: 'สาขา', key: 'branch', value: props.data.branch },
    { label: 'เลขที่ใบรับเงิน', key: 'invoiceNo', value: props.data?.invoiceNo },
    { label: 'วันที่', key: 'date', value: dayjs.formatDate(props.data.date) },
    { label: 'โดย', key: 'createdBy', value: `${props.data.createdBy}` }
  ]
})

</script>
