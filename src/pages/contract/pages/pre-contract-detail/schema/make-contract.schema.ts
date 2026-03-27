import { schema } from '@/utils/Schema'
import { InterestTypeEnum } from '@/enums/modules/contract/InterestType.enum'
import { z } from 'zod'

export const PreAssetWarehouseSchema = z.object({
  id: schema.id('รหัสสินทรัพย์'),
  files: z.array(schema.media).optional().default([]),
  locationId: schema.id('จุดจัดเก็บ')
})

export const PreAssetWarehouseListSchema = z.array(PreAssetWarehouseSchema)

export const InstallmentSchema = z.object({
  loanAmount: z.number().optional(), // for display purpose only, not required in payload
  lateFee: z.number().optional(), // for display purpose only, not required in payload
  installmentCount: z.number({ message: 'กรุณากรอกจำนวนงวด' }).min(1, 'กรุณากรอกจำนวนงวด'),
  annualInterestRate: z.number({ message: 'กรุณากรอกอัตราดอกเบี้ย' }).min(0, 'กรุณากรอกอัตราดอกเบี้ย'),
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
    interestType: 'FLAT_RATE',
    annualInterestRate: 0,
    preAssets: []
  }
}
