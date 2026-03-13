import { computed, ref, type Ref } from 'vue'
import type { IGetAssetList } from '@/models/request/asset/AssetReq.model'
import type { IAssetList } from '@/models/response/asset/AssetRes.model'
import type { IAssetFilter } from '@/models/modules/asset/Filter.model'
import usePagination, { type IUsePagination } from '@/composables/usePagination'

interface IUseList extends IUsePagination {
  filters: Ref<IAssetFilter>
  items: Ref<IAssetList[]>
  fetch(): void
  onClearFilters(): void
}

export default function useList (): IUseList {
  const { search, pagination, sortBy, sortOrder, extractPagination, syncQuery } = usePagination()

  const filters = ref<IAssetFilter>({})
  const items = ref<IAssetList[]>([])
  const allItems = ref<IAssetList[]>([
    { id: 1, assetNo: 'AS-00001', customerName: 'นาย จันทร์ พงษ์พัฒนาโยธิน', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 800000, status: 'WAITING' },
    { id: 2, assetNo: 'AS-00002', customerName: 'นาง พันทวา จิรวรางวงศ์', category: 'อสังหาริมทรัพย์ - บ้าน', value: 1200000, status: 'WAITING' },
    { id: 3, assetNo: 'AS-00003', customerName: 'นางสาว โชติกา ประชาสิริกุล', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 600000, status: 'IN_USE' },
    { id: 4, assetNo: 'AS-00004', customerName: 'นาย ปิยะพร รุ่งดัง', category: 'อสังหาริมทรัพย์ - ห้องชุด', value: 1300000, status: 'IN_USE' },
    { id: 5, assetNo: 'AS-00005', customerName: 'นาย ธรรมศักดิ์ องค์พิทักษ์', category: 'ยานพาหนะ', value: 300000, status: 'SOLD' },
    { id: 6, assetNo: 'AS-00006', customerName: 'นางสาว นัฐพร สุขนาวร', category: 'ยานพาหนะ', value: 900000, status: 'SOLD' },
    { id: 7, assetNo: 'AS-00007', customerName: 'นาง สุทธิพร อุกฤษศาสตร์การ', category: 'ยานพาหนะ', value: 1100000, status: 'IN_USE' },
    { id: 8, assetNo: 'AS-00008', customerName: 'นาย อนุชิต ศุภคำ', category: 'เครื่องมือการเกษตร', value: 500000, status: 'IN_USE' },
    { id: 9, assetNo: 'AS-00009', customerName: 'นางสาว รัตน์กร ยีนตั้ง', category: 'เครื่องมือการเกษตร', value: 1400000, status: 'IN_USE' },
    { id: 10, assetNo: 'AS-00010', customerName: 'นาย วิชัย เกรียงพฤกษ์', category: 'เครื่องมือการเกษตร', value: 250000, status: 'IN_USE' },
    { id: 11, assetNo: 'AS-00011', customerName: 'นาย อภิสิตา เขาคำ', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 700000, status: 'IN_USE' },
    { id: 12, assetNo: 'AS-00012', customerName: 'นางสาว ทิพวดี เรืองทอง', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 1000000, status: 'IN_USE' },
    { id: 13, assetNo: 'AS-00013', customerName: 'นาง สุคนธ์ สุวรรณกร', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 350000, status: 'IN_USE' },
    { id: 14, assetNo: 'AS-00014', customerName: 'นาย ปุณชัย ชัยยุทธการ', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 1500000, status: 'IN_USE' },
    { id: 15, assetNo: 'AS-00015', customerName: 'นางสาว มานิต สุขโชติแก้ว', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 2000000, status: 'IN_USE' },
    { id: 16, assetNo: 'AS-00016', customerName: 'นาย สุพชัย องค์ชวาชาญ', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 400000, status: 'IN_USE' },
    { id: 17, assetNo: 'AS-00017', customerName: 'นาง กาญจนา ชัยวนิช', category: 'อสังหาริมทรัพย์ - ที่ดิน', value: 1600000, status: 'IN_USE' }
  ])

  const paginateQuery = computed((): IGetAssetList => {
    const normalizedFilters = normalizeFilters()
    return {
      search: search.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
      sortBy: sortBy.value || undefined,
      sortOrder: sortOrder.value,
      ...normalizedFilters
    }
  })

  function filterItems (): IAssetList[] {
    const keyword = search.value?.trim().toLowerCase()
    const category = filters.value.category || null
    const status = filters.value.status || null

    return allItems.value.filter((item: IAssetList): boolean => {
      if (category && item.category !== category) return false
      if (status && item.status !== status) return false

      if (!keyword) return true
      const haystack = [
        item.assetNo,
        item.customerName,
        item.category,
        String(item.value),
        item.status
      ].join(' ').toLowerCase()
      return haystack.includes(keyword)
    })
  }

  function paginateItems (list: IAssetList[]): IAssetList[] {
    const page = pagination.value.page || 1
    const limit = pagination.value.limit || 10
    const start = (page - 1) * limit
    const end = start + limit
    return list.slice(start, end)
  }

  function normalizeFilters (): Partial<IGetAssetList> {
    return {}
  }

  function fetch (): void {
    // TODO: replace with API call when asset service is ready
    syncQuery({ ...normalizeFilters() })
    const filtered = filterItems()
    pagination.value.count = filtered.length
    pagination.value.totalPage = Math.ceil(filtered.length / (pagination.value.limit || 10)) || 1
    pagination.value = extractPagination(pagination.value)
    items.value = paginateItems(filtered)
    void paginateQuery.value
  }

  function onClearFilters (): void {
    filters.value = {}
    pagination.value.page = 1
    fetch()
  }

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
