import { ref } from 'vue'

// Module-level singleton so any component shares the same open/close state
const isOpen = ref<boolean>(false)

export function useAppDrawer (): {
  isOpen: typeof isOpen
  open: () => void
  close: () => void
  toggle: () => void
} {
  function open (): void {
    isOpen.value = true
  }

  function close (): void {
    isOpen.value = false
  }

  function toggle (): void {
    isOpen.value = !isOpen.value
  }

  return { isOpen, open, close, toggle }
}
