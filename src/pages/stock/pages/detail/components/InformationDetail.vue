<template>
  <div class="grid grid-cols-2 gap-2.5">
    <BaseContainer>
      <DisplayList :items="leftItems">
        <template #[`value.status`]>
          <ChipStockDocsStatus :value="data.status" />
        </template>
      </displaylist>
    </BaseContainer>
    <div class="flex flex-col gap-2.5">
      <BaseContainer>
        <DisplayList :items="senderItems" />
      </BaseContainer>
      <BaseContainer>
        <DisplayList :items="receiverItems" />
      </BaseContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IStockDocsById } from '@/models/response/stock/StockDocsRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipStockDocsStatus from '../../list/components/ChipStockDocsStatus.vue'

interface IProps {
  data: IStockDocsById
}

const props = defineProps<IProps>()

const dayjs = useDayjs()

const leftItems = computed((): IDisplayList[] => [
  { label: 'สถานะ', key: 'status', value: props.data.status, hideColon: true },
  { label: 'เลขที่ใบย้ายเอกสาร', key: 'docNo', value: props.data.docNo || '-' },
  { label: 'เหตุผล', key: 'reason', value: props.data.reason || '-' }
])

const senderItems = computed((): IDisplayList[] => [
  { label: 'วันที่ย้าย', key: 'transferDate', value: dayjs.formatDate(props.data.transferDate) },
  { label: 'ย้ายโดย', key: 'senderName', value: props.data.senderName || '-' }
])

const receiverItems = computed((): IDisplayList[] => [
  { label: 'วันที่รับ', key: 'receiveDate', value: props.data.receiveDate ? dayjs.formatDate(props.data.receiveDate) : '-' },
  { label: 'รับโดย', key: 'receiverName', value: props.data.receiverName || '-' }
])


</script>

<style scoped>

</style>
