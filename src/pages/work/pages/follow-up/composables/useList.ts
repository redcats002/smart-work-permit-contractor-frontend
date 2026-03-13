import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import usePagination, { type IUsePagination } from '@/composables/usePagination'
import type { IGetNewWorkList } from '@/models/request/work/WorkReq.model'
import type { IFollowUpNewWorkList } from '@/models/response/work/WorkRes.model'
import type { IWorkProvider } from '@/resources/provider/work/Work.provider'
import WorkProvider from '@/resources/provider/work/Work.provider'
import { AssetCategoryStatusEnum } from '@/enums/modules/work/AssetCategoryStatus.enum'

interface IUseList extends IUsePagination {
  filters: Ref<IGetNewWorkList>
  items: Ref<IFollowUpNewWorkList[]>
  fetch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const WorkService: IWorkProvider = new WorkProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IGetNewWorkList>({})
  const items = ref<IFollowUpNewWorkList[]>([])

  const paginateQuery = computed((): IGetNewWorkList => {
    const normalizedFilters = normalizeFilters(filters.value)
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  async function useFetch (): Promise<void> {
    const mock = true // TODO: remove
    if (mock) {
      items.value = [
        {
          id: 1,
          assetNo: 'AS-00001',
          phoneNumber: '088-8888888',
          assetCategory: AssetCategoryStatusEnum.LAND_NS3G,
          contractNo: 'LC-00001',
          customerName: 'นาย จันทร์ พงษ์พัฒนโยธิน'
        },
        {
          id: 2,
          assetCategory: AssetCategoryStatusEnum.LAND_TITLE,
          contractNo: 'LC-00002',
          customerName: 'นาง พันธนา จิรวราภงษ์',
          assetNo: 'AS-00002',
          phoneNumber: '088-8888888'
        },
        {
          id: 3,
          assetCategory: AssetCategoryStatusEnum.LAND_TITLE,
          contractNo: 'LC-00003',
          customerName: 'นางสาว โชติกา ประชายศิริกุล',
          assetNo: 'AS-00003',
          phoneNumber: '088-8888888'
        },
        {
          id: 4,
          assetCategory: AssetCategoryStatusEnum.LAND_TITLE,
          contractNo: 'LC-00004',
          customerName: 'นาย ปิยะพร ชุติ้ง',
          assetNo: 'AS-00004',
          phoneNumber: '088-8888888'
        }
      ]
      return
    }
    const response = await WorkService.getWorkFollowUpPaginate(paginateQuery.value)
    items.value = response.data || []
    pagination.value = extractPagination(response)
    syncQuery({ ...normalizeFilters(filters.value) })
  }


  function normalizeFilters (value: IGetNewWorkList): Partial<IGetNewWorkList> {
    return {
      ...value
    }
  }

  function fetch (): void {
    handleLoading(useFetch)
  }

  function onClearFilters (): void {}


  return {
    filters,
    items,
    pagination,
    sortBy,
    sortOrder,
    search,
    fetch,
    onClearFilters,
    extractPagination,
    syncQuery
  }
}
