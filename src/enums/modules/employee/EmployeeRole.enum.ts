import type { TBaseOption } from '@/models/Global.model'

// 1. กำหนด Enum สำหรับ Role (เพิ่ม ACCOUNTING)
export enum EmployeeRoleEnum {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ACCOUNTING = 'ACCOUNTING'
}

// 2. สร้าง Type จาก Key ของ Enum
export type TEmployeeRole = keyof typeof EmployeeRoleEnum

// 3. Map ภาษาไทยสำหรับแสดงผล (Label)
const roleTitleMap: Record<TEmployeeRole, string> = {
  [EmployeeRoleEnum.ADMIN]: 'ผู้ดูแลระบบ (Admin)',
  [EmployeeRoleEnum.SUPER_ADMIN]: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
  [EmployeeRoleEnum.ACCOUNTING]: 'บัญชี (Accounting)'
}

// 4. Export รายการสำหรับใช้ใน Dropdown/Selection
export const EmployeeRoleItems: TBaseOption[] = Object.values(EmployeeRoleEnum).map(
  (role: TEmployeeRole): TBaseOption => ({
    label: formatRoleTitle(role),
    value: role
  })
)

// 5. ฟังก์ชันสำหรับแปลงค่าเป็นชื่อภาษาไทย
export function formatRoleTitle (role?: TEmployeeRole): string {
  if (!role) return 'ไม่ระบุ'
  return roleTitleMap[role] || 'ไม่พบตำแหน่ง'
}

// 6. ฟังก์ชันสำหรับกำหนดสี (Class) ตามประเภท Role
export function getRoleClass (value?: TEmployeeRole): string {
  switch (value) {
    case EmployeeRoleEnum.SUPER_ADMIN:
      return 'bg-purple-100 text-purple-700 border-none'
    case EmployeeRoleEnum.ADMIN:
      return 'bg-blue-100 text-blue-700 border-none'
    case EmployeeRoleEnum.ACCOUNTING:
      // สีทอง/ส้ม เพื่อให้แยกจาก Admin ได้ชัดเจน
      return 'bg-orange-100 text-orange-700 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

// 7. ฟังก์ชันสำหรับกำหนด Icon ตามประเภท Role
export function getRoleIcon (value?: TEmployeeRole): string {
  switch (value) {
    case EmployeeRoleEnum.SUPER_ADMIN:
      return 'solar:shield-star-bold'
    case EmployeeRoleEnum.ADMIN:
      return 'solar:user-speak-bold'
    case EmployeeRoleEnum.ACCOUNTING:
      // Icon เกี่ยวกับการเงินหรือเอกสาร
      return 'solar:bill-list-bold'
    default:
      return 'mdi:help-circle-outline'
  }
}
