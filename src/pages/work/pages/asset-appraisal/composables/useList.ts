import { computed, ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGetNewWorkList } from '@/models/request/work/WorkReq.model'
import type { IAssetAppraisalNewWorkList } from '@/models/response/work/WorkRes.model'
import { AssetCategoryStatusEnum } from '@/enums/modules/work/AssetCategoryStatus.enum'
import { WorkStatusEnum } from '@/enums/modules/work/WorkStatus.enum'
import type { IWorkProvider } from '@/resources/provider/work/Work.provider'
import WorkProvider from '@/resources/provider/work/Work.provider'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IGetNewWorkList>
  items: Ref<IAssetAppraisalNewWorkList[]>
  fetch(): void
  onClearFilters(): void
}
export default function useList (): IUseList {
  const WorkService: IWorkProvider = new WorkProvider()

  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IGetNewWorkList>({})
  const items = ref<IAssetAppraisalNewWorkList[]>([])

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
          id: '1',
          assetCategory: AssetCategoryStatusEnum.LAND_NS3G,
          contractNo: 'LC-00001',
          customerName: 'นาย จันทร์ พงษ์พัฒนโยธิน',
          status: WorkStatusEnum.IN_PROGRESS
        },
        {
          id: '2',
          assetCategory: AssetCategoryStatusEnum.LAND_TITLE,
          contractNo: 'LC-00002',
          customerName: 'นาง พันธนา จิรวราภงษ์',
          status: WorkStatusEnum.SUCCESS
        },
        {
          id: '3',
          assetCategory: AssetCategoryStatusEnum.LAND_TITLE,
          contractNo: 'LC-00003',
          customerName: 'นางสาว โชติกา ประชายศิริกุล',
          status: WorkStatusEnum.PENDING
        },
        {
          id: '4',
          assetCategory: AssetCategoryStatusEnum.LAND_TITLE,
          contractNo: 'LC-00004',
          customerName: 'นาย ปิยะพร ชุติ้ง',
          status: WorkStatusEnum.CANCELLED
        }
      ]
      return
    }
    const response = await WorkService.getWorkAppraisalPaginate(paginateQuery.value)
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
