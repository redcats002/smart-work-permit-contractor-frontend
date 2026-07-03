<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
    <BaseContainer class="md:col-span-2">
      <CustomerCard
        :data="data?.customer"
        hide-border />
    </BaseContainer>
    <BaseContainer>
      <DisplayList :items="contractItems">
        <template #[`value.status`]>
          <ChipAssetStatus :value="data?.status ?? undefined" />
        </template>
      </DisplayList>
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import type { IPreContractById } from '@/models/response/pre-contract/PreContractRes.model'
import BaseContainer from '@/components/base/BaseContainer.vue'
import type { IDisplayList } from '@/components/display/DisplayList.vue'
import DisplayList from '@/components/display/DisplayList.vue'
import CustomerCard from '../../create/components/CustomerCard.vue'
import ChipAssetStatus from '../../list/components/ChipPreContractStatus.vue'

interface IProps {
  data: IPreContractById | null
}

const props = defineProps<IProps>()

const { formatDate } = useDayjs()


const contractItems = computed((): IDisplayList[] => [
  { key: 'status', label: 'สถานะ', value: props.data?.status },
  { key: 'idNo', label: 'เลขที่สัญญา', value: props.data?.idNo || '-' },
  { key: 'createdAt', label: 'วันที่', value: formatDate(props.data?.contractedAt ?? undefined) },
  { key: 'sellMan', label: 'พนักงาน', value: formatter.fullName(props.data?.sellMan) }
])


</script>

<style scoped>

</style>
