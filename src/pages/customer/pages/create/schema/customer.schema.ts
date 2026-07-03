import { generator } from '@/utils/Generator'
import { schema } from '@/utils/Schema'
import { CustomerStatusEnum } from '@/enums/modules/customer/CustomerStatus.enum'
import { PersonalTypeEnum } from '@/enums/modules/customer/PersonalType.enum'
import { ETitleName } from '@/enums/TitleName.enum'
import { z } from 'zod'

function requireAddressFields (
  address: { address: string, subDistrict: string, district: string, province: string, postCode: string },
  path: string,
  ctx: z.RefinementCtx
): void {
  const messages: Record<'address' | 'subDistrict' | 'district' | 'province' | 'postCode', string> = {
    address: 'กรุณากรอกที่อยู่',
    subDistrict: 'กรุณากรอกตำบล/แขวง',
    district: 'กรุณากรอกอำเภอ/เขต',
    province: 'กรุณากรอกจังหวัด',
    postCode: 'กรุณากรอกรหัสไปรษณีย์'
  }
  for (const field of Object.keys(messages) as (keyof typeof messages)[]) {
    if (!address[field]) {
      ctx.addIssue({ code: 'custom', path: [path, field], message: messages[field] })
    }
  }
}

const CustomerBaseSchema = z.object({

  // ── Classification ───────────────────────────────────────────────────────
  personalType: schema.enum(PersonalTypeEnum, 'ประเภทบุคคล').default(PersonalTypeEnum.INDIVIDUAL),

  // ── Personal Information ─────────────────────────────────────────────────
  // idCard doubles as tax ID for CORPORATE; firstName doubles as company name for CORPORATE
  idCard: z.string().min(13, 'กรุณากรอกเลขบัตรประชาชน 13 หลัก').max(13, 'เลขบัตรประชาชนต้องมี 13 หลัก'),
  titleName: schema.enum(ETitleName, 'คำนำหน้าชื่อ'),
  firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
  lastName: z.string(),
  phoneNumber: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
  phoneNumber2: z.string().optional(),
  birthDate: z.union([schema.date('วันเกิด'), z.literal('')]),
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง').or(z.literal('')).optional(),

  // ── Classification ───────────────────────────────────────────────────────
  status: schema.enum(CustomerStatusEnum, 'สถานะลูกค้า').default(CustomerStatusEnum.ACTIVE),
  customerGroupId: z.number().optional(),
  occupationId: z.number().optional(),

  // ── Citizen / Home Address (always required) ─────────────────────────────
  mainAddress: z.object({
    id: z.number().optional(),
    address: z.string().min(1, 'กรุณากรอกที่อยู่'),
    subDistrict: z.string().min(1, 'กรุณากรอกตำบล/แขวง'),
    district: z.string().min(1, 'กรุณากรอกอำเภอ/เขต'),
    province: z.string().min(1, 'กรุณากรอกจังหวัด'),
    postCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
    urlGoogleMap: z.string().optional(),
    isSameCitizenAddress: z.boolean().optional(),
    isSameCurrentAddress: z.boolean().optional()
  }),

  // ── Current / Mailing Address (required only for INDIVIDUAL) ─────────────
  currentAddress: z.object({
    id: z.number().optional(),
    isSameCitizenAddress: z.boolean().optional(), // true = copy from citizen address
    address: z.string(),
    subDistrict: z.string(),
    district: z.string(),
    province: z.string(),
    postCode: z.string(),
    urlGoogleMap: z.string().optional(),
    isSameCurrentAddress: z.boolean().optional()
  }),

  // ── Work Address (required only for INDIVIDUAL) ───────────────────────────
  workAddress: z.object({
    id: z.number().optional(),
    isSameCurrentAddress: z.boolean().optional(), // true = copy from current address
    isSameCitizenAddress: z.boolean().optional(), // true = copy from main address
    address: z.string(),
    subDistrict: z.string(),
    district: z.string(),
    province: z.string(),
    postCode: z.string(),
    urlGoogleMap: z.string().optional()
  })
})

export const CustomerSchema = CustomerBaseSchema.superRefine((val: z.infer<typeof CustomerBaseSchema>, ctx: z.RefinementCtx) => {
  if (val.personalType !== PersonalTypeEnum.INDIVIDUAL) return
  if (!val.titleName) ctx.addIssue({ code: 'custom', path: ['titleName'], message: 'กรุณาเลือกคำนำหน้าชื่อ' })
  if (!val.lastName) ctx.addIssue({ code: 'custom', path: ['lastName'], message: 'กรุณากรอกนามสกุล' })
  if (!val.birthDate) ctx.addIssue({ code: 'custom', path: ['birthDate'], message: 'กรุณาเลือกวันเดือนปีเกิด' })
  requireAddressFields(val.currentAddress, 'currentAddress', ctx)
  requireAddressFields(val.workAddress, 'workAddress', ctx)
})

export type CustomerFormValues = z.infer<typeof CustomerSchema>

export function useDev (): CustomerFormValues {
  return {
    // Classification
    personalType: PersonalTypeEnum.INDIVIDUAL,
    // Personal
    idCard: generator.generateRandomThaiCitizenId(),
    titleName: ETitleName['MR'],
    firstName: 'Nonthakorn',
    lastName: 'Inthong',
    phoneNumber: generator.generateRandomPhoneNumber(),
    phoneNumber2: '',
    birthDate: '',
    email: '',
    // Classification
    status: CustomerStatusEnum.ACTIVE,
    customerGroupId: undefined,
    occupationId: undefined,
    // Citizen / Home address
    mainAddress: {
      address: 'หลัก',
      subDistrict: 'สายไหม',
      district: 'สายไหม',
      province: 'กรุงเทพมหานคร',
      postCode: '10220',
      urlGoogleMap: '',
      isSameCitizenAddress: false,
      isSameCurrentAddress: false
    },
    // Current / Mailing address
    currentAddress: {
      address: 'ปัจจุบัน',
      subDistrict: 'สายไหม',
      district: 'สายไหม',
      province: 'กรุงเทพมหานคร',
      postCode: '10220',
      urlGoogleMap: '',
      isSameCitizenAddress: false,
      isSameCurrentAddress: false
    },
    // Work address
    workAddress: {
      address: 'ที่ทำงาน',
      subDistrict: 'สายไหม',
      district: 'สายไหม',
      province: 'กรุงเทพมหานคร',
      postCode: '10220',
      urlGoogleMap: '',
      isSameCurrentAddress: false,
      isSameCitizenAddress: false
    }
  }
}

export function useFormInitialValues (): CustomerFormValues {
  return {
    // Classification
    personalType: PersonalTypeEnum.INDIVIDUAL,
    // Personal
    idCard: '',
    titleName: ETitleName.MR,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    phoneNumber2: '',
    birthDate: '',
    email: '',
    // Classification
    status: CustomerStatusEnum.ACTIVE,
    customerGroupId: undefined,
    occupationId: undefined,
    // Citizen / Home address
    mainAddress: {
      address: '',
      subDistrict: '',
      district: '',
      province: '',
      postCode: '',
      urlGoogleMap: '',
      isSameCitizenAddress: false,
      isSameCurrentAddress: false
    },
    // Current / Mailing address
    currentAddress: {
      address: '',
      subDistrict: '',
      district: '',
      province: '',
      postCode: '',
      urlGoogleMap: '',
      isSameCitizenAddress: false,
      isSameCurrentAddress: false
    },
    // Work address
    workAddress: {
      address: '',
      subDistrict: '',
      district: '',
      province: '',
      postCode: '',
      urlGoogleMap: '',
      isSameCurrentAddress: false,
      isSameCitizenAddress: false
    }
  }
}
