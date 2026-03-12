import { schema } from '@/utils/Schema'
import { EstateTypeEnum } from '@/enums/modules/contract/EstateType.enum'
import { z } from 'zod'

export const EstateItemSchema = z.object({
  key: z.string().optional(),
  collateralType: z.enum(EstateTypeEnum, { error: 'กรุณาเลือกประเภทหลักทรัพย์' }),
  detail: z.string().min(1, 'กรุณากรอกรายละเอียด'),
  address: z.string().default(''),
  subDistrict: z.string().min(1, 'กรุณาเลือกตำบล'),
  district: z.string().min(1, 'กรุณาเลือกอำเภอ'),
  province: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  postCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
  urlGoogleMap: z.string().optional()
})

export type IEstateFormItem = z.infer<typeof EstateItemSchema>

export const PreContractSchema = z.object({
  customerId: schema.IdSchema('ลูกค้า'),
  employeeId: schema.IdSchema('หน้างานประเมิน'),
  estates: z
    .array(EstateItemSchema)
    .min(1, 'กรุณาเพิ่มหลักทรัพย์อย่างน้อย 1 รายการ')
})

export type PreContractFormValues = z.infer<typeof PreContractSchema>

export function createEstateItem (): IEstateFormItem {
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    collateralType: EstateTypeEnum.LAND_NS3K_WITHOUT_STRUCTURE,
    detail: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postCode: '',
    urlGoogleMap: ''
  }
}

export function useFormInitialValues (): PreContractFormValues {
  return {
    customerId: undefined,
    employeeId: undefined,
    estates: [createEstateItem()]
  }
}
