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
