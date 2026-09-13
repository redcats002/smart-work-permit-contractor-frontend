import { afterAll } from 'vitest'

// Shared jsdom shim. jsdom implements neither `ResizeObserver` nor `matchMedia`. Wayfinder 113
// is the first thing in this repo to mount PrimeVue's unstyled Tabs family (src/volt/Tabs.vue et
// al.) — its `TabList` calls `ResizeObserver` unconditionally from `mounted()` (ink-bar sizing;
// see src/volt/TabList.vue's comment on why the ink bar itself is switched off, which does not
// stop PrimeVue from measuring it) regardless of which PT classes hide the element. Without this,
// every test that mounts `PermitDetailPage.vue` throws `ReferenceError: ResizeObserver is not
// defined` from inside PrimeVue, which vitest reports as an unhandled rejection that corrupts
// later assertions in the same file. One shared setup file avoids re-stubbing this per test file
// — the same fix `smart-work-permit-frontend/src/tests/setup.ts` already carries for its own
// table pager's `Select`.
if (typeof window !== 'undefined' && typeof window.ResizeObserver !== 'function') {
  class StubResizeObserver {
    public observe (): void {}

    public unobserve (): void {}

    public disconnect (): void {}
  }
  Object.defineProperty(window, 'ResizeObserver', { writable: true, value: StubResizeObserver })
}

// PrimeVue's TabList also schedules a raw `setTimeout(() => this.updateInkBar(), 150)` in its own
// `mounted()` (node_modules/primevue/tablist/index.mjs) to position the sliding ink bar once
// layout has settled -- and its `beforeUnmount()` only unbinds the resize/ink-bar OBSERVERS, never
// `clearTimeout`s this one. A missing clearTimeout in the library itself, not this app's code.
//
// Any test mounting a `<Tabs>` page (PermitDetailPage's tabbed detail view) leaves that timer
// pending after the test that mounted it finishes. Most of the time another test in the same file
// outlives the 150ms before the file's environment tears down and nothing is seen. When the LAST
// such mount in a file happens to land close to its last test, the timer instead fires into an
// environment vitest has already begun tearing down for the next file -- `ReferenceError:
// HTMLElement is not defined`, thrown from inside primevue's own updateInkBar. `vitest run` treats
// that as an unhandled error and fails the run's exit code even though every test passed (same
// root cause fixed in `smart-work-permit-frontend/src/tests/setup.ts`, 2026-09-12/13).
//
// Waiting slightly longer than the library's own 150ms, once per file after its last test, lets
// any straggler fire safely while this file's environment is still the live one.
afterAll(async (): Promise<void> => {
  await new Promise<void>((resolve: () => void): void => {
    setTimeout(resolve, 200)
  })
})
