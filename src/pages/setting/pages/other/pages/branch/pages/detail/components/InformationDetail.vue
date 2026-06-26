<template>
  <BaseContainer>
    <template #topright>
      <BranchDetailMenuAction
        @delete="emits('delete')"
        @edit="emits('edit')" />
    </template>
    <DisplayList :items="items">
      <template #[`value.status`]="{ value}">
        <ChipBranchStatus :value="value" />
      </template>
      <template #[`value.branchTimes`]>
        <div class="flex flex-col gap-4">
          <span v-if="!data.branchTimes.length">-</span>
          <template v-else>
            <div
              v-for="(e, i) in data.branchTimes"
              :key="`branch-time-${i}-${e?.id}`">
              <span class="mr-2">{{ daysList(e) }}</span>  <span>{{ e?.openTime }} - {{ e?.closeTime }}</span>
            </div>
          </template>
        </div>
      </template>
      <template #[`value.taxId`]="{ value }">
        <CitizenId :value="value" />
      </template>
    </DisplayList>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IBranchTime } from '@/models/modules/branch/BranchTime.model'
import type { IBranchById } from '@/models/response/branch/BranchRes.model'
import { formatDayToThai, type TDays } from '@/enums/Date.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import CitizenId from '@/components/display/CitizenId.vue'
import DisplayList, { type IDisplayList } from '@/components/display/DisplayList.vue'
import ChipBranchStatus from '../../list/components/ChipBranchStatus.vue'
import BranchDetailMenuAction from './BranchDetailMenuAction.vue'

interface IProps {
  data: IBranchById
}
interface IEmits {
  edit: []
  delete: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const dayjs = useDayjs()

const items = computed((): IDisplayList<IBranchById>[] => {
  return [
    { label: 'สถานะ', key: 'status', value: props.data.status, hideColon: true },
    { label: 'เลขที่สาขา', key: 'idNo', value: props.data?.idNo || props.data?.id },
    { label: 'ชื่อสาขา', key: 'name', value: props.data.name },
    { label: 'Branch Code', key: 'idNo', value: props.data?.idNo?.slice(-5) },
    { label: 'เลขประจำตัวผู้เสียภาษี', key: 'taxId', value: props.data?.taxId },
    { label: 'วันที่เปิดสาขา', key: 'openAt', value: dayjs.formatDate(props.data?.openAt) },
    { label: 'เปิดทำการมาแล้ว', key: 'operatingSince', value: dayjs.formatAge(props.data?.openAt) || '-' },
    { label: 'หัวหน้าสาย', key: 'lineHead', value: props.data?.lineHead || '-' },
    { label: 'ที่อยู่', key: 'address', value: formatter.fullAddress({ address: props.data?.address, district: props.data?.district, postCode: props.data?.postCode, province: props.data?.province, subDistrict: props.data?.subDistrict }) || '-' },
    { label: 'วัน/เวลา ทำการ', key: 'branchTimes', value: props.data?.branchTimes }
  ]
})

function daysList (e: IBranchTime): string {
  return e?.day.map((d: TDays): string => formatDayToThai(d)).join(', ')
}
</script>

<style scoped>

</style>
