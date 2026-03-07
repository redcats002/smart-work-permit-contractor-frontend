import { useDayjs } from '@/utils/Dayjs'
import type { IActionCustomerPayload } from '@/models/request/customer/CustomerReq.model'
import { CustomerStatusEnum } from '@/enums/modules/customer/CustomerStatus.enum'
import { ETitleName } from '@/enums/TitleName.enum'
import { z } from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// ZodShape<T> — maps every key of an interface to a matching Zod type.
// Use with `satisfies` on the shape object literal so TypeScript enforces that:
//   • every required key from T is present in the schema
//   • the Zod output type is assignable to T[K] for each key
// Because `satisfies` doesn't widen the type, `z.infer<typeof Schema>` still
// gives the precise inferred type instead of the broader interface type.
// ─────────────────────────────────────────────────────────────────────────────
type ZodShape<T extends object> = {
  [K in keyof T]-?: z.ZodType<T[K]>
}

export const CustomerSchema = z.object({

  // ── Personal Information ─────────────────────────────────────────────────
  idCard: z.string().min(13, 'กรุณากรอกเลขบัตรประชาชน 13 หลัก').max(13, 'เลขบัตรประชาชนต้องมี 13 หลัก'),
  titleName: z.enum(ETitleName, 'กรุณาเลือกคำนำหน้าชื่อ'),
  firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  phoneNumber: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
  phoneNumber2: z.string().optional(),
  birthDate: z.date().min(1, 'กรุณาเลือกวันเกิด').transform((val: Date): string => {
    const dayjs = useDayjs()
    const parse = dayjs(val).toISOString()
    return dayjs(val).isValid() ? parse : val.toString()
  }),
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง').or(z.literal('')).optional(),

  // ── Classification ───────────────────────────────────────────────────────
  status: z.enum(CustomerStatusEnum, 'กรุณาเลือกสถานะลูกค้า'),
  customerGroupId: z.number().optional(),
  occupationId: z.number().optional(),

  // ── Citizen / Home Address ───────────────────────────────────────────────
  mainAddress: z.object({
    address: z.string().min(1, 'กรุณากรอกที่อยู่'),
    subDistrict: z.string().min(1, 'กรุณากรอกตำบล/แขวง'),
    district: z.string().min(1, 'กรุณากรอกอำเภอ/เขต'),
    province: z.string().min(1, 'กรุณากรอกจังหวัด'),
    postalCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
    urlGoogleMap: z.string().optional(),
    isSameCitizenAddress: z.boolean().optional(),
    isSameCurrentAddress: z.boolean().optional()
  }),

  // ── Current / Mailing Address ────────────────────────────────────────────
  currentAddress: z.object({
    isSameCitizenAddress: z.boolean().optional(), // true = copy from citizen address
    address: z.string().min(1, 'กรุณากรอกที่อยู่'),
    subDistrict: z.string().min(1, 'กรุณากรอกตำบล/แขวง'),
    district: z.string().min(1, 'กรุณากรอกอำเภอ/เขต'),
    province: z.string().min(1, 'กรุณากรอกจังหวัด'),
    postalCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
    urlGoogleMap: z.string().optional(),
    isSameCurrentAddress: z.boolean().optional()
  }),

  // ── Work Address ─────────────────────────────────────────────────────────
  workAddress: z.object({
    isSameCurrentAddress: z.boolean().optional(), // true = copy from current address
    isSameCitizenAddress: z.boolean().optional(), // true = copy from main address
    address: z.string().min(1, 'กรุณากรอกที่อยู่'),
    subDistrict: z.string().min(1, 'กรุณากรอกตำบล/แขวง'),
    district: z.string().min(1, 'กรุณากรอกอำเภอ/เขต'),
    province: z.string().min(1, 'กรุณากรอกจังหวัด'),
    postalCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
    urlGoogleMap: z.string().optional()
  })

} satisfies ZodShape<IActionCustomerPayload>)

export type CustomerFormValues = z.infer<typeof CustomerSchema>

export function useDev (): CustomerFormValues {
  return {
    // Personal
    idCard: '5873621543566',
    titleName: ETitleName['MR'],
    firstName: 'Nonthakorn',
    lastName: 'Inthong',
    phoneNumber: '0812345678',
    phoneNumber2: '',
    birthDate: '',
    email: '',
    // Classification
    status: CustomerStatusEnum.INACTIVE,
    customerGroupId: undefined,
    occupationId: undefined,
    // Citizen / Home address
    mainAddress: {
      address: 'หลัก',
      subDistrict: 'สายไหม',
      district: 'สายไหม',
      province: 'กรุงเทพมหานคร',
      postalCode: '10220',
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
      postalCode: '10220',
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
      postalCode: '10220',
      urlGoogleMap: '',
      isSameCurrentAddress: false,
      isSameCitizenAddress: false
    }
  }
}

export function useFormInitialValues (): CustomerFormValues {
  return {
    // Personal
    idCard: '',
    titleName: ETitleName[''],
    firstName: '',
    lastName: '',
    phoneNumber: '',
    phoneNumber2: '',
    birthDate: '',
    email: '',
    // Classification
    status: CustomerStatusEnum.INACTIVE,
    customerGroupId: undefined,
    occupationId: undefined,
    // Citizen / Home address
    mainAddress: {
      address: '',
      subDistrict: '',
      district: '',
      province: '',
      postalCode: '',
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
      postalCode: '',
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
      postalCode: '',
      urlGoogleMap: '',
      isSameCurrentAddress: false,
      isSameCitizenAddress: false
    }
  }
}
