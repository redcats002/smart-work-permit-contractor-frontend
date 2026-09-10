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
    searchPlaceholder: 'ค้นหาด้วยชื่อผู้ปฏิบัติงาน',
    filterByWorker: {
      placeholder: 'ผู้ปฏิบัติงานทั้งหมด'
    },
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
    noFile: 'ไม่มีไฟล์แนบ',
    hasFile: 'มีไฟล์แนบ',
    viewHint: 'ดูรายละเอียด'
  },
  type: {
    'hot-work': 'งานร้อน (Hot Work)',
    'confined-space-entry': 'ที่อับอากาศ (Confined Space Entry)',
    'working-at-heights': 'ทำงานบนที่สูง (Working at Heights)'
  },
  detail: {
    title: 'รายละเอียดใบรับรอง',
    editButton: 'แก้ไขใบรับรอง',
    backToList: 'กลับไปหน้ารายการ',
    attachment: 'ไฟล์แนบ',
    openFile: 'เปิดไฟล์แนบ',
    openingFile: 'กำลังเปิด…',
    registered: 'บันทึกเมื่อ',
    lastUpdated: 'แก้ไขล่าสุด',
    error: {
      loadFailed: 'ไม่สามารถโหลดใบรับรองนี้ได้ กรุณาลองใหม่อีกครั้ง',
      fileFailed: 'ไม่สามารถเปิดไฟล์แนบได้ กรุณาลองใหม่อีกครั้ง'
    }
  },
  edit: {
    title: 'แก้ไขใบรับรอง',
    submit: 'บันทึกการแก้ไข',
    cancel: 'ยกเลิก',
    saved: 'แก้ไขใบรับรองแล้ว',
    currentFile: 'ไฟล์แนบปัจจุบัน',
    replaceFile: 'เปลี่ยนไฟล์แนบ',
    keepFileHint: 'เว้นว่างไว้เพื่อใช้ไฟล์เดิม',
    removeFile: 'นำไฟล์แนบออก',
    removeFileHint: 'ใบรับรองจะถูกบันทึกโดยไม่มีไฟล์แนบ',
    undoRemoveFile: 'ใช้ไฟล์เดิมต่อ'
  },
  form: {
    title: 'เพิ่มใบรับรอง',
    field: {
      workerName: 'ชื่อพนักงาน',
      role: 'ตำแหน่ง',
      certType: 'ชนิดบัตร',
      certTypePlaceholder: 'เลือกชนิดบัตร',
      certTypeUnknownRoleNote: 'แสดงชนิดบัตรทั้งหมด เนื่องจากตำแหน่งของพนักงานคนนี้ไม่อยู่ในรายการที่กำหนด',
      certTypeLegacyLabel: '{value} (ไม่อยู่ในรายการมาตรฐาน)',
      issuedDate: 'วันที่ออก',
      expiryDate: 'วันหมดอายุ',
      licenceNo: 'เลขที่ใบอนุญาต',
      licenceNoPlaceholder: 'กรอกเลขที่ใบอนุญาต (ไม่บังคับ)',
      description: 'รายละเอียด',
      descriptionPlaceholder: 'รายละเอียดการอบรมหรือการทดสอบ (ไม่บังคับ)',
      licenceOrAttachmentHint: 'ต้องมีเลขที่ใบอนุญาตหรือไฟล์แนบอย่างน้อยหนึ่งอย่าง',
      file: 'ไฟล์แนบ',
      filePlaceholder: 'แนบไฟล์ (ไม่บังคับ)'
    },
    submit: 'บันทึกใบรับรอง',
    validation: {
      workerNameRequired: 'กรุณากรอกชื่อพนักงาน',
      roleRequired: 'กรุณากรอกตำแหน่ง',
      certTypeRequired: 'กรุณาเลือกชนิดบัตร',
      fileType: 'ไฟล์ต้องเป็นภาพ JPEG, PNG, WEBP, HEIC หรือไฟล์ PDF',
      expiryAfterIssued: 'วันหมดอายุต้องอยู่หลังวันที่ออก'
    }
  }
}

export default certificate
