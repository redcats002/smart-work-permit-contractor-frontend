import type certificateEn from '@/locales/en/certificate'

const certificate: typeof certificateEn = {
  title: 'ใบรับรองการทำงาน',
  status: {
    // Thai fragments sourced from SmartWorkPermit-v3.dc.html certCards badge strings
    // (~line 2254-2258) — the design bakes these as fixed demo text, not per-locale T.tXX
    // keys, so this reassembles the same Thai wording into a clean localized label.
    VALID: '✓ สมบูรณ์',
    EXPIRING_SOON: '⚠ กำลังหมดอายุ',
    EXPIRED: '✕ หมดอายุ'
  },
  list: {
    title: 'ใบรับรองการทำงาน',
    // Design's own Thai copy (SmartWorkPermit-v3.dc.html T.t64) is this short —
    // not a truncation on our side.
    subtitle: 'เชื่อมกับการส่งใบอนุญาต',
    addButton: 'เพิ่มบัตรรับรอง',
    empty: {
      title: 'ยังไม่มีใบรับรอง',
      description: 'ใบรับรองที่คุณเพิ่มให้พนักงานจะแสดงที่นี่'
    },
    error: {
      loadFailed: 'ไม่สามารถโหลดใบรับรองได้ กรุณาลองใหม่อีกครั้ง'
    }
  },
  card: {
    certType: 'ชนิดบัตร',
    issued: 'ออกเมื่อ',
    expiry: 'หมดอายุ',
    noFile: 'ไม่มีไฟล์แนบ'
  },
  form: {
    title: 'เพิ่มใบรับรอง',
    field: {
      workerName: 'ชื่อพนักงาน',
      role: 'ตำแหน่ง',
      certType: 'ชนิดบัตร',
      issuedDate: 'วันที่ออก',
      expiryDate: 'วันหมดอายุ',
      file: 'ไฟล์แนบ',
      filePlaceholder: 'แนบไฟล์ (ไม่บังคับ)'
    },
    submit: 'บันทึกใบรับรอง',
    validation: {
      workerNameRequired: 'กรุณากรอกชื่อพนักงาน',
      roleRequired: 'กรุณากรอกตำแหน่ง',
      certTypeRequired: 'กรุณากรอกชนิดบัตร',
      fileType: 'ไฟล์ต้องเป็นรูปภาพหรือ PDF',
      expiryAfterIssued: 'วันหมดอายุต้องอยู่หลังวันที่ออก'
    }
  }
}

export default certificate
