import { useAuthStore } from '@/stores/Auth'
import { RolePermissions, type TPermissionAction, type TPermissionModule } from '@/utils/Permission'

export function usePermission () {
  const authStore = useAuthStore()

  function hasPermission (module: TPermissionModule, action?: TPermissionAction): boolean {
    const role = authStore.user?.role
    if (!role) return false

    const permissions = RolePermissions[role]
    if (!permissions) return false

    const modulePermissions = permissions[module]
    if (!modulePermissions) return false

    if (!action) {
      return modulePermissions.length > 0
    }

    return modulePermissions.includes(action)
  }

  return {
    hasPermission
  }
}
