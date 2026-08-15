import type errorEn from '@/locales/en/error'

/**
 * TODO: TH copy — reviewed by a Thai safety professional before release.
 * These strings are shown when the backend blocks a permit action. Placeholder
 * translations are deliberately literal; do not paraphrase safety or legal terms.
 */
const error: typeof errorEn = {
  GAS_OUT_OF_RANGE: 'ค่าที่วัดได้อยู่นอกเกณฑ์ความปลอดภัย ระบบปฏิเสธค่านี้ — กรุณาตรวจวัดใหม่แล้วส่งอีกครั้ง',
  ENTRANTS_STILL_INSIDE: 'ไม่สามารถปิดใบอนุญาตได้ — ยังมีผู้ปฏิบัติงานอยู่ภายในพื้นที่',
  CERT_EXPIRED: 'มีผู้ปฏิบัติงานที่ใบรับรองหมดอายุหรือไม่มีใบรับรอง',
  FIRE_WATCH_NOT_ELAPSED: 'ยังปิดใบอนุญาตไม่ได้ ต้องรอจนครบเวลาเฝ้าระวังไฟ 30 นาที',
  unknown: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
}

export default error
