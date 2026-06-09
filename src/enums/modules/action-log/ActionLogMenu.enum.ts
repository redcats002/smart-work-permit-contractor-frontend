export enum ActionLogMenuEnum {
  'ANNOUNCEMENT' = 'ANNOUNCEMENT',
  'WORK' = 'WORK',
  'DASHBOARD' = 'DASHBOARD',
  'CONTRACT' = 'CONTRACT',
  'CUSTOMER' = 'CUSTOMER',
  'CONTRACT-ASSETS' = 'CONTRACT-ASSETS',
  'DOCUMENT-FINANCE' = 'DOCUMENT-FINANCE',
  'DOCUMENT-STORAGE' = 'DOCUMENT-STORAGE',
  'REPORT' = 'REPORT',
  'SETTING' = 'SETTING',
  'EMPLOYEE' = 'EMPLOYEE'
}

export type ActionLogMenu = keyof typeof ActionLogMenuEnum

const menuTitleMap: Record<string, string> = {
  'ANNOUNCEMENT': 'ข่าวสาร',
  'WORK': 'งาน',
  'DASHBOARD': 'แดชบอร์ด',
  'CONTRACT': 'สัญญา',
  'CUSTOMER': 'ลูกค้า',
  'CONTRACT-ASSETS': 'หลักทรัพย์',
  'DOCUMENT-FINANCE': 'เอกสารและการเงิน',
  'DOCUMENT-STORAGE': 'การจัดเก็บ',
  'REPORT': 'รายงาน',
  'SETTING': 'ตั้งค่า',
  'EMPLOYEE': 'พนักงาน'
}

export function formatMenuTitle (menu?: string): string {
  if (!menu) return 'ไม่ระบุ'
  return menuTitleMap[menu] ?? menu
}
