const menuTitleMap: Record<string, string> = {
  'ANNOUNCEMENT': 'ข่าวสาร',
  'WORK': 'งาน',
  'DASHBOARD': 'แดชบอร์ด',
  'CONTRACT': 'สัญญา',
  'CUSTOMER': 'ลูกค้า',
  'CONTRACT-ASSETS': 'หลักทรัพย์',
  'DOCUMENT-FINANCE': 'เอกสารและการเงิน',
  'DOCUMENT-STORAGE': 'การจัดเก็บ',
  'REPORT': 'รายงาน'
}

export function formatMenuTitle (menu?: string): string {
  if (!menu) return 'ไม่ระบุ'
  return menuTitleMap[menu] ?? menu
}
