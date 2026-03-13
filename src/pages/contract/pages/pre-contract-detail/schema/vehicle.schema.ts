import { z } from 'zod'

export const VehicleSchema = z.object({
  assetType: z.string().min(1, 'กรุณาเลือกประเภททรัพย์สิน'),
  detail: z.string().min(1, 'กรุณากรอกรายละเอียด'),
  licensePlate: z.string().min(1, 'กรุณากรอกทะเบียนรถ'),
  vehicleProvince: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  yearManufactured: z.number().min(1900, 'ปีที่ผลิตไม่ถูกต้อง').nullable(),
  yearRegistered: z.number().min(1900, 'ปีจดทะเบียนไม่ถูกต้อง').nullable(),
  chassisNumber: z.string().min(1, 'กรุณากรอกเลขตัวถังรถ'),
  mileage: z.number().min(0, 'เลขไมล์ต้องไม่เป็นลบ').nullable()
})

export type VehicleFormValues = z.infer<typeof VehicleSchema>
