import z from 'zod'
import { schema } from '@/utils/Schema'
import { InterestTypeEnum } from '@/enums/modules/contract/InterestType.enum'

export const PreAssetWarehouseSchema = z.object({
  id: schema.id('รหัสสินทรัพย์'),
  files: z.array(schema.media).min(1, 'กรุณาแนบเอกสารหลักทรัพย์อย่างน้อย 1 ไฟล์'),
  locationId: schema.id('จุดจัดเก็บ')
})

export const PreAssetWarehouseListSchema = z.array(PreAssetWarehouseSchema)

export const InstallmentSchema = z.object({
  loanAmount: z.number().optional(), // for display purpose only, not required in payload
  lateFee: z.number().optional(), // for display purpose only, not required in payload
  installmentCount: z.number({ message: 'กรุณากรอกจำนวนงวด' }).min(1, 'กรุณากรอกจำนวนงวด').default(0),
  annualInterestRate: z.number({ message: 'กรุณากรอกอัตราดอกเบี้ย' }).min(1, 'กรุณากรอกอัตราดอกเบี้ย').default(0),
  interestType: schema.enum(InterestTypeEnum, 'ประเภทดอกเบี้ย')
})
export const MakeContractSchema = z.object({
  ...InstallmentSchema.shape,
  preAssets: PreAssetWarehouseListSchema
})

export type PreAssetWarehouseFormValues = z.infer<typeof PreAssetWarehouseSchema>
export type PreAssetWarehouseListFormValues = z.infer<typeof PreAssetWarehouseListSchema>
export type InstallmentFormValues = z.infer<typeof InstallmentSchema>
export type MakeContractFormValues = z.infer<typeof MakeContractSchema>

export function useFormInitialValues (): MakeContractFormValues {
  return {
    loanAmount: 0,
    lateFee: 0,
    installmentCount: 0,
    annualInterestRate: 0,
    interestType: 'FLAT_RATE',
    preAssets: []
  }
}
