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
  }
}

export default worker
