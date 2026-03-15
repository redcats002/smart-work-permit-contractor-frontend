import { schema } from '@/utils/Schema'
import { StockStatusEnum } from '@/enums/modules/stock/StockStatus.enum'
import { z } from 'zod'
import { StockSchema } from './stock.schema'

export const StockDocsSchema = z.object({
  // ── ข้อมูลหลักทรัพย์ (Asset Information) ────────────────────────────────
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
  formWarehouse: z.string().min(1, 'กรุณาระบุคลังต้นทาง'),
  toWarehouse: z.string().min(1, 'กรุณาระบุคลังปลายทาง'),
  reason: z.string().min(1, 'กรุณาระบุเหตุผล'),

  // ── สถานะของหลักทรัพย์ ───────────────────────────────────────────────
  status: z.enum(StockStatusEnum, 'กรุณาเลือกสถานะหลักทรัพย์'),

  items: z.array(StockSchema).min(1, 'กรุณาเลือกหลักทรัพย์อย่างน้อย 1 รายการ')
})

export type StockDocsFormValues = z.infer<typeof StockDocsSchema>

export function useFormInitialValues (): StockDocsFormValues {
  return {
    assetNo: '',
    contractNo: '',
    receivedDate: '',
    firstName: '',
    lastName: '',
    category: '',
    warehouse: '',
    storageLocation: '',
    formWarehouse: '',
    toWarehouse: '',
    reason: '',
    status: StockStatusEnum.ACTIVE,
    items: []
  }
}

export function useDev (): StockDocsFormValues {
  return {
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
    formWarehouse: '',
    toWarehouse: '',
    reason: '',
    items: [
      {
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
        type: ''
      }
    ]
  }
}
