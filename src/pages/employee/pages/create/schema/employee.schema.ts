import { useDayjs } from '@/utils/Dayjs'
import { generator } from '@/utils/Generator'
import { ETitleName } from '@/enums/TitleName.enum'
import { z } from 'zod'
import { EmployeeStatusEnum } from '@/enums/modules/employee/EmployeeStatus.enum'

export const EmployeeSchema = z.object({

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
  status: z.enum(EmployeeStatusEnum, 'กรุณาเลือกสถานะลูกค้า'),
  role: z.string().min(1, 'กรุณาเลือกตำแหน่ง'),
  branchId: z.number().min(1, 'กรุณาเลือกสาขา'),

  // ── Citizen / Home Address ───────────────────────────────────────────────
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

  // ── Current / Mailing Address ────────────────────────────────────────────
  currentAddress: z.object({
    id: z.number().optional(),
    isSameCitizenAddress: z.boolean().optional(), // true = copy from citizen address
    address: z.string().min(1, 'กรุณากรอกที่อยู่'),
    subDistrict: z.string().min(1, 'กรุณากรอกตำบล/แขวง'),
    district: z.string().min(1, 'กรุณากรอกอำเภอ/เขต'),
    province: z.string().min(1, 'กรุณากรอกจังหวัด'),
    postCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
    urlGoogleMap: z.string().optional(),
    isSameCurrentAddress: z.boolean().optional()
  }),

  // ── Work Address ─────────────────────────────────────────────────────────
  workAddress: z.object({
    id: z.number().optional(),
    isSameCurrentAddress: z.boolean().optional(), // true = copy from current address
    isSameCitizenAddress: z.boolean().optional(), // true = copy from main address
    address: z.string().min(1, 'กรุณากรอกที่อยู่'),
    subDistrict: z.string().min(1, 'กรุณากรอกตำบล/แขวง'),
    district: z.string().min(1, 'กรุณากรอกอำเภอ/เขต'),
    province: z.string().min(1, 'กรุณากรอกจังหวัด'),
    postCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
    urlGoogleMap: z.string().optional()
  })
})

export type EmployeeFormValues = z.infer<typeof EmployeeSchema>

export function useDev (): EmployeeFormValues {
  return {
    // Personal
    idCard: generator.generateRandomThaiCitizenId(),
    titleName: ETitleName['MR'],
    firstName: 'Nonthakorn',
    lastName: 'Inthong',
    phoneNumber: generator.generateRandomPhoneNumber(),
    phoneNumber2: '',
    birthDate: '',
    email: '',
    role: '',
    branchId: 0,
    // Classification
    status: EmployeeStatusEnum.INACTIVE,
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

export function useFormInitialValues (): EmployeeFormValues {
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
    role: '',
    branchId: 0,
    // Classification
    status: EmployeeStatusEnum.INACTIVE,
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
