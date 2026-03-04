export function scrollToTop (behavior: ScrollBehavior = 'smooth'): void {
  const scrollContainer = document.querySelector<HTMLElement>('[data-app-scroll="true"]')
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0, behavior })
    return
  }
  window.scrollTo({ top: 0, behavior })
}
