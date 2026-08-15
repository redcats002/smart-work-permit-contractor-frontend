import type commonEn from '@/locales/en/common'

const common: typeof commonEn = {
  back: 'กลับ',
  next: 'ต่อไป',
  clear: 'ล้าง',
  close: 'ปิด',
  view: 'ดู',
  cancel: 'ยกเลิก',
  confirm: 'ยืนยัน',
  save: 'บันทึก',
  submit: 'ส่ง',
  yes: 'ใช่',
  no: 'ไม่ใช่',
  notApplicable: 'N/A',
  validation: {
    required: 'กรุณาเลือก{label}',
    requiredField: 'กรุณาระบุ{label}',
    invalidImageUrl: 'URL รูปภาพไม่ถูกต้อง',
    invalidImagePath: 'PATH รูปภาพไม่ถูกต้อง',
    invalidImageName: 'ชื่อรูปภาพไม่ถูกต้อง',
    invalidFileType: 'ไฟล์ต้องเป็นรูปภาพหรือ PDF'
  }
}

export default common
