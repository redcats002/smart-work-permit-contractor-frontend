import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'

interface IBackChainReturn {
  backChainPaths: ComputedRef<Set<string>>
  isInBackChain: (to: RouteLocationRaw) => boolean
}

export function useBackChain (): IBackChainReturn {
  const route = useRoute()
  const router = useRouter()

  const backChainPaths = computed((): Set<string> => {
    const paths = new Set<string>()
    let backMeta = route.meta.back as { name?: string } | undefined
    const visited = new Set<string>()

    while (backMeta?.name && !visited.has(backMeta.name)) {
      visited.add(backMeta.name)
      const resolved = router.resolve({ name: backMeta.name })
      paths.add(resolved.path)
      backMeta = resolved.meta.back as { name?: string } | undefined
    }

    return paths
  })

  function isInBackChain (to: RouteLocationRaw): boolean {
    return backChainPaths.value.has(router.resolve(to).path)
  }

  return { backChainPaths, isInBackChain }
}
