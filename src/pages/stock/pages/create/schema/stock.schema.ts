import { schema } from '@/utils/Schema'
import { StockStatusEnum } from '@/enums/modules/stock/StockStatus.enum'
import { z } from 'zod'

export const StockSchema = z.object({
  // ── ข้อมูลหลักทรัพย์ (Asset Information) ────────────────────────────────
  id: z.number(),
  assetNo: z.string().min(1, 'กรุณากรอกเลขที่หลักทรัพย์'),
  contractNo: z.string().min(1, 'กรุณากรอกเลขที่สัญญา'),
  receivedDate: schema.date('วันที่รับหลักทรัพย์'),

  // ── ข้อมูลผู้ครอบครอง/ลูกค้า ──────────────────────────────────────────
  titleName: z.string().optional(),
  firstName: z.string().min(1, 'กรุณากรอกชื่อลูกค้า'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุลลูกค้า'),

  // ── การจัดหมวดหมู่และสถานที่ ──────────────────────────────────────────
  category: z.string().min(1, 'กรุณาเลือกหมวดหมู่'),
  warehouse: z.string().min(1, 'กรุณาเลือกคลัง'),
  storageLocation: z.string().min(1, 'กรุณาระบุจุดจัดเก็บ'),

  // ── สถานะของหลักทรัพย์ ───────────────────────────────────────────────
  status: z.enum(StockStatusEnum, 'กรุณาเลือกสถานะหลักทรัพย์'),
  type: z.string().min(1, 'กรุณาระบุประเภท')
})

export type StockFormValues = z.infer<typeof StockSchema>

export function useFormInitialValues (): StockFormValues {
  return {
    id: 0,
    assetNo: '',
    contractNo: '',
    receivedDate: '',
    titleName: '',
    firstName: '',
    lastName: '',
    category: '',
    warehouse: '',
    storageLocation: '',
    status: StockStatusEnum.ACTIVE,
    type: ''
  }
}

export function useDev (): StockFormValues {
  return {
    id: 0,
    assetNo: 'AS-00001',
    contractNo: 'LC-00001',
    receivedDate: new Date().toISOString(),
    titleName: 'นาย',
    firstName: 'จันทร์',
    lastName: 'พงษ์พัฒนโยธิน',
    category: 'อสังหาริมทรัพย์ - ที่ดิน',
    warehouse: 'สำนักงานใหญ่',
    storageLocation: 'BR001-31-13',
    status: StockStatusEnum.ACTIVE,
    type: 'น.ส. 4 - ครุฑแดง'
  }
}
