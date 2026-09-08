import { describe, expect, it } from 'vitest'
import { routes } from '@/router/index'
import type { RouteRecordRaw } from 'vue-router'

/**
 * wayfinder ticket 030 — "titles are per-route, not one global string". Every authenticated
 * destination already had its own `meta.title` (each `<Domain>.router.ts`); the three common
 * error routes declared inline here did not and fell back to the bare "e-safework" default. This
 * pins that they now carry their own, so `router.afterEach`'s `document.title = ... to.meta.title
 * ...` in `src/router/index.ts` never silently falls back for a route a user can actually land on.
 */
function findRoute (name: string): RouteRecordRaw | undefined {
  return routes.find((route: RouteRecordRaw): boolean => route.name === name)
}

describe('router — every reachable route owns its own title (wayfinder 030)', () => {
  it.each(['NotPermittedPage', 'NotAvailablePage', 'NotFound'])('%s declares a non-empty meta.title', (name: string) => {
    const route = findRoute(name)
    expect(route).toBeDefined()
    expect(typeof route?.meta?.title).toBe('string')
    expect((route?.meta?.title as string).length).toBeGreaterThan(0)
  })
})
