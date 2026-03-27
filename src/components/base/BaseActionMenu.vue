<template>
  <div>
    <div
      aria-controls="overlay_menu"
      aria-haspopup="true"
      class="flex items-center justify-end cursor-pointer hover:text-surface-100"
      variant="text"
      @click="toggle($event)">
      <Icon
        :class="iconClass"
        :icon="icon"
        :stroke-width="2"
        class="size-5 text-primary hover:text-primary-900 transition-all duration-200" />
    </div>
    <Menu
      id="overlay_menu"
      ref="menu"
      :class="menuClass"
      :model="menuItems"
      class="text-sm"
      popup>
      <template #item="{props: itemProps, item}">
        <slot
          v-if="$slots[`item.${item.key}`]"
          :item="item"
          :name="`item.${item.key}`"
          :props="itemProps" />
        <div
          v-else
          class="flex items-center p-2 cursor-pointer"
          v-bind="itemProps">
          <span>{{ item?.label }}</span>
        </div>
      </template>
    </Menu>
    <DeleteModal
      v-if="modalType === 'DELETE'"
      v-model="modalVisible"
      @confirm="onModalConfirm()" />
    <ConfirmModal
      v-else-if="modalType === 'CONFIRM'"
      v-model="modalVisible"
      @confirm="onModalConfirm()" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { Icon } from '@iconify/vue'
import ConfirmModal from '../modal/ConfirmModal.vue'
import DeleteModal from '../modal/DeleteModal.vue'

export interface IMenuItemAction {
  label: string
  key: string
  type?: 'TEXT' | 'DELETE' | 'CONFIRM'
  icon?: string
  disabled?: boolean
  action?: () => void
  separator?: boolean
}

interface IMenuItem {
  key: string
  label?: string
  icon?: string
  disabled?: boolean
  type?: 'TEXT' | 'DELETE' | 'CONFIRM'
  separator?: boolean
  command?: () => void | any
}

interface IProps {
  items: IMenuItemAction[]
  icon?: string
  iconClass?: string
  menuClass?: string
}

const props = withDefaults(defineProps<IProps>(), {
  icon: 'qlementine-icons:menu-dots-16',
  iconClass: '',
  menuClass: ''
})

const menuRef = useTemplateRef('menu')

const modalVisible = ref<boolean>(false)
const modalType = ref<'DELETE' | 'CONFIRM' | null>(null)
const pendingModalAction = ref<(() => void) | undefined>(undefined)

const menuItems = computed((): IMenuItem[] =>
  props.items.map((item: IMenuItemAction): IMenuItem => {
    if (item.separator) {
      return { separator: true, key: item.key }
    }

    return {
      label: item.label,
      icon: item.icon,
      disabled: item.disabled,
      key: item.key,
      type: item.type,
      command: (): void => {
        if (item.type === 'DELETE' || item.type === 'CONFIRM') {
          pendingModalAction.value = item.action
          modalType.value = item.type
          modalVisible.value = true
        } else {
          item.action?.()
        }
      }
    }
  })
)

function onModalConfirm (): void {
  pendingModalAction.value?.()
  pendingModalAction.value = undefined
  modalVisible.value = false
  modalType.value = null
}

function toggle (event: Event): void {
  menuRef.value?.toggle(event)
}
</script>
