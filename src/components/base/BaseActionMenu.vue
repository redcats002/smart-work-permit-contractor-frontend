<template>
  <div>
    <div
      aria-controls="overlay_menu"
      aria-haspopup="true"
      class="flex items-center justify-end cursor-pointer hover:text-surface-100"
      variant="text"
      @click="toggle($event)">
      <Icon
        :stroke-width="2"
        class="size-5 text-primary hover:text-primary-900 transition-all duration-200"
        icon="qlementine-icons:menu-dots-16" />
    </div>
    <Menu
      id="overlay_menu"
      ref="menu"
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
      v-model="deleteModalVisible"
      @confirm="onDeleteConfirm()" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { Icon } from '@iconify/vue'
import DeleteModal from '../modal/DeleteModal.vue'

export interface IMenuItemAction {
  label: string
  key: string
  type: 'TEXT' | 'DELETE'
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
  type?: 'TEXT' | 'DELETE'
  separator?: boolean
  command?: () => void | any
}

interface IProps {
  items: IMenuItemAction[]
}

const props = defineProps<IProps>()

const menuRef = useTemplateRef('menu')

const deleteModalVisible = ref<boolean>(false)
const pendingDeleteAction = ref<(() => void) | undefined>(undefined)

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
        if (item.type === 'DELETE') {
          // Store the action and open the modal after the menu has closed
          pendingDeleteAction.value = item.action
          deleteModalVisible.value = true
        } else {
          item.action?.()
        }
      }
    }
  })
)

function onDeleteConfirm (): void {
  pendingDeleteAction.value?.()
  pendingDeleteAction.value = undefined
  deleteModalVisible.value = false
}

function toggle (event: Event): void {
  menuRef.value?.toggle(event)
}
</script>
