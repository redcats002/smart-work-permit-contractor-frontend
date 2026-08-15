import type historyEn from '@/locales/en/history'

const history: typeof historyEn = {
  title: 'ประวัติใบอนุญาต',
  subtitle: 'ใบอนุญาตที่ปิดหรือหมดอายุ (อ่านอย่างเดียว)',
  exportCsv: 'ส่งออก',
  type: {
    all: 'ทุกประเภท',
    hot: 'งานร้อน',
    confined: 'ที่อับอากาศ',
    heights: 'ที่สูง'
  },
  status: {
    all: 'ทุกสถานะ',
    CLOSED: 'ปิดแล้ว',
    EXPIRED: 'หมดอายุ'
  },
  toolbar: {
    searchPlaceholder: 'ค้นหา ID, ชื่องาน, สถานที่',
    // TODO: TH copy — design (SmartWorkPermit-v3.dc.html T table) never localizes
    // these two filter-bar titles as separate strings, only the hardcoded
    // date-input `title` attributes ("From date · จากวันที่" / "To date · ถึงวันที่").
    dateFrom: 'จากวันที่',
    dateTo: 'ถึงวันที่',
    clear: 'ล้าง'
  },
  table: {
    columns: {
      id: 'เลขที่',
      type: 'ประเภท',
      titleLocation: 'ชื่องาน · สถานที่',
      closed: 'ปิด/หมดอายุ',
      duration: 'ระยะเวลา',
      status: 'สถานะ'
    }
  },
  // TODO: TH copy — design binds `histResultCount` without any static copy string
  // (English or Thai) to source this phrasing from.
  resultCount: '{count} permits found',
  empty: {
    title: 'ไม่พบใบอนุญาตที่ตรงกับตัวกรอง',
    description: 'ลองล้างการค้นหาหรือปรับตัวกรอง',
    clearFilters: 'ล้างตัวกรอง'
  },
  error: {
    loadFailed: 'ไม่สามารถโหลดประวัติได้ กรุณาลองใหม่อีกครั้ง',
    detailFailed: 'ไม่สามารถโหลดรายละเอียดใบอนุญาตได้ กรุณาลองใหม่อีกครั้ง',
    exportFailed: 'ไม่สามารถส่งออกไฟล์ CSV ได้ กรุณาลองใหม่อีกครั้ง'
  },
  drawer: {
    close: 'ปิด',
    // TODO: TH copy — design (SmartWorkPermit-v3.dc.html line 699) hardcodes this
    // view-only banner in English only, no Thai variant appears in the prototype.
    viewOnly: 'View Only · {status} — this record is archived and cannot be edited.',
    sectionDetails: 'รายละเอียดใบอนุญาต',
    location: 'สถานที่',
    foreman: 'หัวหน้างาน',
    workDate: 'วันทำงาน',
    duration: 'ระยะเวลา',
    closedDate: 'วันที่ปิด',
    closedBy: 'ปิดโดย',
    sectionWorkDescription: 'รายละเอียดงาน',
    downloadPdf: 'ดาวน์โหลดใบอนุญาต',
    placeholderChip: 'placeholder'
  }
}

export default history
