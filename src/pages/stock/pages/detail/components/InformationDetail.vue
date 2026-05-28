<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
    <BaseContainer>
      <DisplayList :items="leftItems">
        <template #[`value.status`]>
          <ChipMovementStatus :value="data.status" />
        </template>
      </DisplayList>
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
import { formatter } from '@/utils/Formatter'
import type { IDocumentMovementById } from '@/models/response/document-storage/DocumentStorageRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipMovementStatus from '../../list/components/ChipMovementStatus.vue'

interface IProps {
  data: IDocumentMovementById
}

const props = defineProps<IProps>()

const dayjs = useDayjs()

const leftItems = computed((): IDisplayList[] => [
  { label: 'สถานะ', key: 'status', value: props.data.status, hideColon: true },
  { label: 'เลขที่ใบย้ายเอกสาร', key: 'idNo', value: props.data.idNo || '-' },
  { label: 'คลังต้นทาง', key: 'originWarehouse', value: props.data.originWarehouse?.name || '-' },
  { label: 'คลังปลายทาง', key: 'destinationWarehouse', value: props.data.destinationWarehouse?.name || '-' },
  { label: 'เหตุผล', key: 'reason', value: props.data.reason || '-' }
])

const senderItems = computed((): IDisplayList[] => [
  { label: 'วันที่ย้าย', key: 'createdAt', value: dayjs.formatDate(props.data.createdAt) },
  { label: 'ย้ายโดย', key: 'createdByEmployee', value: formatter.fullName(props.data.createdByEmployee) || '-' }
])

const receiverItems = computed((): IDisplayList[] => [
  { label: 'วันที่รับ', key: 'receiveDate', value: props.data.receiveDate ? dayjs.formatDate(props.data.receiveDate) : '-' },
  { label: 'รับโดย', key: 'receiverName', value: formatter.fullName(props.data.receivedByEmployee) || '-' }
])


</script>

<style scoped>

</style>
