import { type Component, computed } from 'vue'
import useTabItems, {
  importComponent,
  type ITabItemComponent,
  type IUseTabItems
} from '@/composables/useTabItems'

export function useInitDetail (): IUseTabItems {
  const DocumentHistoryTab: Component = importComponent((): Promise<Component> => import('../components/tab/DocumentHistoryTab.vue'))
  const AuctionTab: Component = importComponent((): Promise<Component> => import('../components/tab/AuctionTab.vue'))

  const { tab, tabItems } = useTabItems(
    computed((): ITabItemComponent[] => [
      {
        label: 'ประวัติการจัดเก็บเอกสาร',
        value: 'history',
        instance: DocumentHistoryTab
      },
      {
        label: 'ขายต่อ/ประมูล',
        value: 'auction',
        instance: AuctionTab
      }
    ])
  )
  return { tab, tabItems }
}
