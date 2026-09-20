import type { RouteLocationNormalized } from 'vue-router'

/**
 * Per-route <head> updates for the one public route this app has (`/`, the LandingPage rendered
 * by HomePage.vue for an unauthenticated visitor) — every other route stays the authenticated,
 * non-indexable app it already was, and reverts `<meta name="robots">` back to
 * "noindex, nofollow" via DEFAULT_ROBOTS.
 *
 * There is no @unhead/vue or @vueuse/head dependency in this repo, and AGENTS.md forbids adding
 * one without flagging it first — this is deliberately the same shape as router/index.ts's
 * existing `document.title = ...` line in `afterEach`, just extended to a few more tags, not a new
 * pattern. This only helps a crawler that actually executes JavaScript (Googlebot does; many
 * others do not) — public/robots.txt (`Allow: /$` / `Disallow: /`) is the path-aware gate that
 * also works for a non-JS crawler or one that reads robots.txt before any HTML, and
 * index.html's static <meta name="robots" content="noindex, nofollow"> is what that same non-JS
 * crawler sees on first paint, on every route including `/`, until this module overwrites it.
 */

const ROBOTS_SELECTOR = 'meta[name="robots"]'
const DESCRIPTION_SELECTOR = 'meta[name="description"]'
const OG_TITLE_SELECTOR = 'meta[property="og:title"]'
const OG_DESCRIPTION_SELECTOR = 'meta[property="og:description"]'
const OG_URL_SELECTOR = 'meta[property="og:url"]'
const DEFAULT_ROBOTS = 'noindex, nofollow'

let fallbackDescription: string | null = null

function setMetaContent (selector: string, content: string): void {
  const tag = document.querySelector(selector)
  if (tag) tag.setAttribute('content', content)
}

/**
 * Call once per navigation, from router/index.ts's `afterEach`. `to.meta.description` (present
 * only on the landing route today) drives `<meta name="description">` and the three Open Graph
 * tags; every other route reverts to index.html's original fallback description, and its OG tags
 * fall back to the same string so they are never left holding a stale route's copy.
 */
export function applyRouteSeo (to: RouteLocationNormalized): void {
  if (fallbackDescription === null) {
    fallbackDescription = document.querySelector(DESCRIPTION_SELECTOR)?.getAttribute('content') ?? ''
  }

  const description = (to.meta?.description as string | undefined) ?? fallbackDescription
  const ogUrl = (to.meta?.ogUrl as string | undefined) ?? window.location.origin + '/'
  const robots = (to.meta?.robots as string | undefined) ?? DEFAULT_ROBOTS

  setMetaContent(ROBOTS_SELECTOR, robots)
  setMetaContent(DESCRIPTION_SELECTOR, description)
  setMetaContent(OG_TITLE_SELECTOR, (to.meta?.title as string | undefined) ?? document.title)
  setMetaContent(OG_DESCRIPTION_SELECTOR, description)
  setMetaContent(OG_URL_SELECTOR, ogUrl)
}
