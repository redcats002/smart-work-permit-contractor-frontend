import type { IDashboardData } from '@/models/response/dashboard/DashboardRes.model'

export const dashboardMock: IDashboardData = {
  summaryCards: [
    {
      key: 'daily',
      title: 'สรุปยอดประจำวัน',
      amount: '200,000',
      icon: 'solar:wallet-linear',
      iconClass: 'bg-red-100 text-(--p-red)',
      cardClass: 'border border-(--p-gray-5)'
    },
    {
      key: 'cash',
      title: 'ยอดเงินจากเงินสด',
      amount: '100,000',
      icon: 'iconoir:cash',
      iconClass: 'bg-emerald-100 text-emerald-600',
      cardClass: 'border border-(--p-gray-5)'
    },
    {
      key: 'qr',
      title: 'ยอดเงินจาก QR Code',
      amount: '100,000',
      icon: 'majesticons:qr-code-line',
      iconClass: 'bg-sky-100 text-sky-600',
      cardClass: 'border border-(--p-gray-5)'
    }
  ],
  statCards: [
    {
      key: 'debt',
      title: 'ยอดหนี้คงเหลือ',
      amount: '34,500',
      cardClass: 'border border-(--p-gray-5)',
      icon: 'solar:wallet-linear',
      iconClass: 'bg-orange-100 text-orange-400'
    },
    {
      key: 'principal',
      title: 'เงินต้นคงเหลือ',
      amount: '30,000',
      cardClass: 'border border-(--p-gray-5)',
      icon: 'solar:wallet-linear',
      iconClass: 'bg-orange-100 text-orange-400'
    },
    {
      key: 'interest',
      title: 'ดอกเบี้ยคงเหลือ',
      amount: '10,133.80',
      cardClass: 'border border-(--p-gray-5)',
      icon: 'solar:wallet-linear',
      iconClass: 'bg-orange-100 text-orange-400'
    }
  ],
  marketing: {
    title: 'แบบประเมินผลลัพธ์การตลาดในการปล่อยสินเชื่อ',
    centerValue: '3,289',
    centerUnit: 'ราย',
    rows: [
      { label: 'ลูกค้าเก่า', value: '1,500', unit: 'ราย', percent: '45.61%' },
      { label: 'รีไฟแนนซ์', value: '1,000', unit: 'ราย', percent: '30.40%' },
      { label: 'ออนไลน์', value: '500', unit: 'ราย', percent: '15.20%' },
      { label: 'ติดป้าย + แจกใบปลิว', value: '200', unit: 'ราย', percent: '6.08%' },
      { label: 'มีผู้นำมา', value: '80', unit: 'ราย', percent: '2.43%' },
      { label: 'เจอด้วยตัวเอง', value: '9', unit: 'ราย', percent: '0.28%' }
    ]
  },
  loanSummary: {
    title: 'สรุปยอดปล่อยสินเชื่อ',
    centerValue: '7,870,667',
    centerUnit: 'บาท',
    rows: [
      { label: 'ลูกค้าเก่า', value: '1,870,667', unit: 'บาท', percent: '45.61%' },
      { label: 'รีไฟแนนซ์', value: '1,000,000', unit: 'บาท', percent: '30.40%' },
      { label: 'ออนไลน์', value: '1,000,000', unit: 'บาท', percent: '15.20%' },
      { label: 'ติดป้าย + แจกใบปลิว', value: '1,000,000', unit: 'บาท', percent: '6.08%' },
      { label: 'มีผู้นำมา', value: '1,000,000', unit: 'บาท', percent: '2.43%' },
      { label: 'เจอด้วยตัวเอง', value: '1,000,000', unit: 'บาท', percent: '0.28%' }
    ]
  }
}
