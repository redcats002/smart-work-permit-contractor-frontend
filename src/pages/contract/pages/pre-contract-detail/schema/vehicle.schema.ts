import { schema } from '@/utils/Schema'
import { z } from 'zod'
import { VehicleSchema as FormValues } from '../../create/schema/pre-contract.schema'

export const VehicleFormSchema = z.object({
  ...FormValues.shape,
  id: schema.id('รหัสรถ')
})

export type VehicleFormValues = z.infer<typeof VehicleFormSchema>

export const ModalVehicleSchema = z.object({
  type: z.string().min(1, 'กรุณาเลือกประเภทหลักทรัพย์'),
  detail: z.string().default(''),
  plateNo: z.string().min(1, 'กรุณากรอกเลขทะเบียนรถ'),
  province: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  manufactureYear: z.string().refine((val: string | null | undefined): boolean => !!val, 'กรุณาเลือกปีที่ผลิต'),
  registrationYear: z.string().refine((val: string | null | undefined): boolean => !!val, 'กรุณาเลือกปีที่จดทะเบียน'),
  vehicleIdentificationNo: z.string().min(1, 'กรุณากรอกหมายเลขตัวถัง'),
  mileage: z.number({ message: 'กรุณากรอกเลขไมล์' }).refine((val: number | null | undefined): boolean => val != null, 'กรุณากรอกเลขไมล์')
})
