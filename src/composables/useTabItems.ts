import { type Component, computed, type ComputedRef, defineAsyncComponent, markRaw, ref, type Ref } from 'vue'
import { type RouteLocationRaw, useRoute } from 'vue-router'
import ComponentLoader from '@/components/loader/ComponentLoader.vue'

export interface ITabItem {
  label: string
  value: string
  [key: string]: any
}

export interface IUseTabItems {
  tab: Ref<string>
  tabItems: ComputedRef<any[]>
}

export interface ITabItemComponent extends ITabItem {
  key?: string
  instance?: Component
  props?: any
  to?: RouteLocationRaw
}

export function importComponent (loader: () => Promise<Component>): Component {
  return markRaw(
    defineAsyncComponent({
      loader,
      loadingComponent: ComponentLoader
    })
  )
}

export default function useTabItems (components: ComputedRef<ITabItemComponent[]>): IUseTabItems {
  const route = useRoute()
  const tabItems = computed((): any[] => {
    return components.value.map((component: ITabItemComponent): any => ({
      label: component?.label,
      value: component?.value || component?.label,
      to: component?.to,
      component: {
        instance: component?.instance,
        props: component?.props
      }
    }))
  })

  return {
    tab: ref<string>(route?.query?.tab as string || tabItems?.value?.[0]?.value || ''),
    tabItems
  }
}

export { useTabItems }
