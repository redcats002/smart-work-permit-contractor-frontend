import type { Ref } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IBranchTime } from '@/models/modules/branch/BranchTime.model'
import type { IBranchById } from '@/models/response/branch/BranchRes.model'
import type { EDays } from '@/enums/Date.enum'
import type { BranchStatusEnum } from '@/enums/modules/branch/BranchStatus.enum'
import type { BranchFormValues, BranchTimeFormValues } from '../../create/schema/branch.schema'

const dayjs = useDayjs()

export function useInitForm (form: Ref<BranchFormValues>, data: IBranchById): void {
  form.value = {
    ...data,
    idNo: data?.idNo || '',
    name: data?.name || '',
    openAt: (data.openAt ? dayjs(data.openAt).toISOString() : '') as unknown as string,
    branchTimes: data?.branchTimes.map((item: IBranchTime): BranchTimeFormValues => ({
      ...item,
      closeTime: item.closeTime,
      openTime: item.openTime,
      day: item.day as EDays[]
    })) || [],
    status: data?.status as BranchStatusEnum
  }
}
