import { type Component, computed, type ComputedRef, ref, type Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export interface IUseTabItems {
  tab: Ref<string>
  tabItems: ComputedRef<any[]>
}

export interface ITabItemComponent {
  key?: string
  title: string
  value?: string
  instance?: Component
  props?: any
  to?: RouteLocationRaw
}

export default function useTabItems (components: ComputedRef<ITabItemComponent[]>): IUseTabItems {
  const tabItems = computed((): any[] => {
    return components.value.map((component: ITabItemComponent): any => ({
      title: component?.title,
      value: component?.value || component?.title,
      to: component?.to,
      component: {
        instance: component?.instance,
        props: component?.props
      }
    }))
  })

  return {
    tab: ref<string>(tabItems?.value?.[0]?.value || ''),
    tabItems
  }
}

export { useTabItems }
