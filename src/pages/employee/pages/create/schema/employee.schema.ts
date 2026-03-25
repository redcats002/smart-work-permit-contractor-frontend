import { generator } from '@/utils/Generator'
import { regex } from '@/utils/Regex'
import { schema } from '@/utils/Schema'
import { EmployeeRoleEnum } from '@/enums/modules/employee/EmployeeRole.enum'
import { EmployeeStatusEnum } from '@/enums/modules/employee/EmployeeStatus.enum'
import { ETitleName } from '@/enums/TitleName.enum'
import { z } from 'zod'

export const EmployeeSchema = z.object({

  // ── Personal Information ─────────────────────────────────────────────────
  idCard: z.string().min(13, 'กรุณากรอกเลขบัตรประชาชน 13 หลัก').max(13, 'เลขบัตรประชาชนต้องมี 13 หลัก'),
  title: z.enum(ETitleName, 'กรุณาเลือกคำนำหน้าชื่อ'),
  firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  phoneNumber: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง').or(z.literal('')).optional(),
  dateOfBirth: schema.date('วันเกิด'),
  // image: z.instanceof(File).optional().nullable(),
  image: z.string().optional().nullable(),
  password: z
    .string()
    .min(8, { message: 'ต้องมีตัวอักษรภาษาอังกฤษ และตัวเลข รวมกันอย่างน้อย 8 ถึง 16 ตัว' })
    .max(16, { message: 'ต้องมีตัวอักษรภาษาอังกฤษ และตัวเลข รวมกันอย่างน้อย 8 ถึง 16 ตัว' })
    .refine((value: string): boolean => regex.upperCaseOneCharRegex.test(value), {
      message: 'ต้องมีอักษรภาษาอังกฤษพิมพ์ใหญ่อย่างน้อย 1 ตัว'
    })
    .refine((value: string): boolean => regex.atLeastOneNumber.test(value), {
      message: 'ต้องมี 0-9 อย่างน้อย 1 ตัว'
    }),
  // ── Classification ───────────────────────────────────────────────────────
  status: schema.enum(EmployeeStatusEnum, 'กรุณาเลือกสถานะลูกค้า'),
  role: schema.enum(EmployeeRoleEnum, 'ตำแหน่ง'),
  branchIds: z.array(z.string()).min(1, 'กรุณาเลือกสาขา'),

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
  })
})

export type EmployeeFormValues = z.infer<typeof EmployeeSchema>

export function useDev (): EmployeeFormValues {
  return {
    // Personal
    idCard: generator.generateRandomThaiCitizenId(),
    title: ETitleName['MR'],
    firstName: 'Nonthakorn',
    lastName: 'Inthong',
    phoneNumber: generator.generateRandomPhoneNumber(),
    dateOfBirth: '',
    email: '',
    password: 'Password1',
    role: '',
    branchIds: [],
    image: null,
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
    }
  }
}

export function useFormInitialValues (): EmployeeFormValues {
  // return {
  //   // Personal
  //   idCard: '',
  //   password: '',
  //   image: null,
  //   title: ETitleName[''],
  //   firstName: '',
  //   lastName: '',
  //   phoneNumber: '',
  //   dateOfBirth: '',
  //   email: '',
  //   role: '',
  //   branchIds: [],
  //   // Classification
  //   status: EmployeeStatusEnum.INACTIVE,
  //   // Citizen / Home address
  //   mainAddress: {
  //     address: '',
  //     subDistrict: '',
  //     district: '',
  //     province: '',
  //     postCode: '',
  //     urlGoogleMap: '',
  //     isSameCitizenAddress: false,
  //     isSameCurrentAddress: false
  //   },
  //   // Current / Mailing address
  //   currentAddress: {
  //     address: '',
  //     subDistrict: '',
  //     district: '',
  //     province: '',
  //     postCode: '',
  //     urlGoogleMap: '',
  //     isSameCitizenAddress: false,
  //     isSameCurrentAddress: false
  //   }
  // }
  return {
    // Personal Information
    idCard: '1700401323201',
    password: 'Password1234', // ใส่ค่าไว้เพื่อให้ผ่าน Validation กฎ 8-16 ตัว + พิมพ์ใหญ่ + ตัวเลข
    image: '',
    title: ETitleName['MR'],
    firstName: 'Chetsadakorn',
    lastName: 'Mueangnam',
    phoneNumber: '082-363-6036',
    dateOfBirth: '2000-08-16T17:00:00.000Z',
    email: 'chet@softnova.co',

    // Classification
    role: EmployeeRoleEnum['SUPER_ADMIN'], // ใช้ Enum ให้ถูกต้อง
    branchIds: ['mJafJK7f1njqwBCKorZ7h9D8kEL3Bo9K'],
    status: EmployeeStatusEnum.INACTIVE,

    // Citizen / Home address
    mainAddress: {
      address: '42',
      subDistrict: 'หนองสองห้อง',
      district: 'บ้านแพ้ว',
      province: 'สมุทรสาคร',
      postCode: '74120',
      urlGoogleMap: '',
      isSameCitizenAddress: false,
      isSameCurrentAddress: false
    },

    // Current / Mailing address
    currentAddress: {
      address: '42',
      subDistrict: 'หนองสองห้อง',
      district: 'บ้านแพ้ว',
      province: 'สมุทรสาคร',
      postCode: '74120',
      urlGoogleMap: '',
      isSameCitizenAddress: true,
      isSameCurrentAddress: false
    }
  }
}
