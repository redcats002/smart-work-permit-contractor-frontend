import type workerEn from '@/locales/en/worker'

const worker: typeof workerEn = {
  picker: {
    label: 'ผู้ปฏิบัติงาน',
    placeholder: 'ค้นหาชื่อผู้ปฏิบัติงาน',
    noMatch: 'ไม่พบผู้ปฏิบัติงานที่ตรงกัน เพิ่มใหม่ได้ด้านล่าง',
    addNew: 'เพิ่ม "{name}" เป็นผู้ปฏิบัติงานใหม่',
    createHint: 'กำลังเพิ่ม "{name}" เป็นผู้ปฏิบัติงานใหม่ ตำแหน่งคืออะไร',
    rolePlaceholder: 'ตำแหน่ง เช่น ช่างเชื่อม',
    createButton: 'เพิ่มผู้ปฏิบัติงาน',
    creating: 'กำลังเพิ่ม…'
  },
  validation: {
    required: 'กรุณาเลือกผู้ปฏิบัติงาน หรือเพิ่มใหม่'
  },
  list: {
    title: 'ผู้ปฏิบัติงาน',
    subtitle: 'ผู้ปฏิบัติงานที่ลงทะเบียนไว้ทั้งหมด ใบรับรอง และใบอนุญาตที่เกี่ยวข้อง',
    addButton: 'ลงทะเบียนผู้ปฏิบัติงาน',
    searchPlaceholder: 'ค้นหาด้วยชื่อ',
    column: {
      name: 'ชื่อ',
      role: 'ตำแหน่ง',
      certificate: 'ใบรับรอง',
      permits: 'ใบอนุญาต'
    },
    certificate: {
      none: 'ไม่มีใบรับรอง'
    },
    empty: {
      title: 'ยังไม่มีผู้ปฏิบัติงาน',
      description: 'ลงทะเบียนผู้ปฏิบัติงานคนแรกเพื่อเริ่มแนบใบรับรองและเพิ่มเข้าใบอนุญาต'
    },
    error: {
      loadFailed: 'ไม่สามารถโหลดรายชื่อผู้ปฏิบัติงานได้'
    }
  },
  detail: {
    backToList: 'กลับไปที่ผู้ปฏิบัติงาน',
    title: 'ผู้ปฏิบัติงาน',
    editButton: 'แก้ไข',
    saveButton: 'บันทึก',
    retireButton: 'ปลดประจำการ',
    retiredBadge: 'ปลดประจำการแล้ว',
    sectionIdentity: 'ข้อมูลประจำตัว',
    fieldName: 'ชื่อ',
    fieldRole: 'ตำแหน่ง',
    fieldIdCardNo: 'เลขบัตรประชาชน',
    fieldPhone: 'เบอร์โทรศัพท์',
    savedToast: 'บันทึกข้อมูลผู้ปฏิบัติงานแล้ว',
    error: {
      loadFailed: 'ไม่สามารถโหลดข้อมูลผู้ปฏิบัติงานนี้ได้',
      saveFailed: 'ไม่สามารถบันทึกการเปลี่ยนแปลงนี้ได้'
    },
    sectionCertificates: 'ใบรับรอง',
    addCertificate: 'เพิ่มใบรับรอง',
    certificatesEmpty: 'ยังไม่มีใบรับรองสำหรับผู้ปฏิบัติงานคนนี้',
    sectionPermits: 'ใบอนุญาต',
    permitsEmpty: 'ผู้ปฏิบัติงานคนนี้ยังไม่มีชื่ออยู่ในใบอนุญาตใด',
    qr: {
      title: 'QR ผู้ปฏิบัติงาน',
      hint: 'สแกนเพื่อตรวจสอบผู้ปฏิบัติงานคนนี้ที่หน้างาน',
      alt: 'QR โค้ดที่เก็บรหัสผู้ปฏิบัติงานคนนี้'
    },
    retire: {
      title: 'ปลดประจำการผู้ปฏิบัติงานคนนี้หรือไม่?',
      description: 'จะหายไปจากรายการแนะนำและรายชื่อผู้ปฏิบัติงาน แต่ยังคงอ่านได้จากใบรับรองและใบอนุญาตที่อ้างถึงอยู่',
      confirm: 'ใช่ ปลดประจำการ'
    },
    retiredToast: 'ปลดประจำการผู้ปฏิบัติงานแล้ว'
  },
  form: {
    createTitle: 'ลงทะเบียนผู้ปฏิบัติงาน',
    fieldName: 'ชื่อ',
    fieldRole: 'ตำแหน่ง',
    fieldIdCardNo: 'เลขบัตรประชาชน',
    fieldPhone: 'เบอร์โทรศัพท์',
    submit: 'ลงทะเบียน',
    validation: {
      nameRequired: 'กรุณากรอกชื่อ',
      roleRequired: 'กรุณาเลือกตำแหน่ง'
    }
  }
}

export default worker
