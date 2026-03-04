import { z } from 'zod'

// Schema derived from ICreateCustomerPayload
// z.object<T> is intentionally omitted (Zod v4 changed generic semantics);
// type safety is enforced via z.infer<typeof CustomerSchema> below.
export const CustomerSchema = z.object({

  // ── Personal Information ─────────────────────────────────────────────────
  citizenId: z.string().min(13, 'กรุณากรอกเลขบัตรประชาชน 13 หลัก').max(13, 'เลขบัตรประชาชนต้องมี 13 หลัก'),
  titleName: z.enum(['MR', 'MS', 'MRS'] as const, { message: 'กรุณาเลือกคำนำหน้า' }),
  firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  phoneNumber: z.string().min(1, 'กรุณากรอกเบอร์โทรศัพท์'),
  phoneNumber2: z.string().optional(),
  birthDate: z.preprocess((val: unknown): string | undefined => {
    if (val instanceof Date) return val.toISOString()
    if (typeof val === 'string') return val
    return undefined
  }, z.string({ message: 'กรุณาเลือกวันเกิด' })),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').optional(),

  // ── Classification ───────────────────────────────────────────────────────
  customerStatus: z.enum(['ACTIVE', 'IN_ACTIVE'] as const, { message: 'กรุณาเลือกสถานะลูกค้า' }),
  customerGroupId: z.number().optional(),
  jobId: z.number().optional(),

  // ── Citizen / Home Address ───────────────────────────────────────────────
  address: z.string().min(1, 'กรุณากรอกที่อยู่'),
  subDistrict: z.string().min(1, 'กรุณากรอกตำบล/แขวง'),
  district: z.string().min(1, 'กรุณากรอกอำเภอ/เขต'),
  province: z.string().min(1, 'กรุณากรอกจังหวัด'),
  postalCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),

  // ── Current / Mailing Address ────────────────────────────────────────────
  isSameCitizenAddress: z.boolean().optional(), // true = copy from citizen address
  currentAddress: z.string().min(1, 'กรุณากรอกที่อยู่ปัจจุบัน'),
  currentSubDistrict: z.string().min(1, 'กรุณากรอกตำบล/แขวง'),
  currentDistrict: z.string().min(1, 'กรุณากรอกอำเภอ/เขต'),
  currentProvince: z.string().min(1, 'กรุณากรอกจังหวัด'),
  currentPostalCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
  currentUrlMap: z.string().optional(),

  // ── Work Address ─────────────────────────────────────────────────────────
  isSameCurrentAddress: z.boolean().optional(), // true = copy from current address
  workAddress: z.string().min(1, 'กรุณากรอกที่อยู่ที่ทำงาน'),
  workSubDistrict: z.string().min(1, 'กรุณากรอกตำบล/แขวง'),
  workDistrict: z.string().min(1, 'กรุณากรอกอำเภอ/เขต'),
  workProvince: z.string().min(1, 'กรุณากรอกจังหวัด'),
  workPostalCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
  workUrlMap: z.string().optional()

})

export type CustomerFormValues = z.infer<typeof CustomerSchema>

// Initial values use Partial<> because required fields are empty before the user fills the form.
// The schema validates on submit, not on mount.
export function useFormInitialValues (): CustomerFormValues {
  return {
    // Personal
    citizenId: '',
    titleName: 'MR',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    phoneNumber2: '',
    birthDate: '',
    email: '',
    // Classification
    customerStatus: 'IN_ACTIVE',
    customerGroupId: undefined,
    jobId: undefined,
    // Citizen / Home address
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: '',
    // Current / Mailing address
    isSameCitizenAddress: false,
    currentAddress: '',
    currentSubDistrict: '',
    currentDistrict: '',
    currentProvince: '',
    currentPostalCode: '',
    currentUrlMap: '',
    // Work address
    isSameCurrentAddress: false,
    workAddress: '',
    workSubDistrict: '',
    workDistrict: '',
    workProvince: '',
    workPostalCode: '',
    workUrlMap: ''
  }
}
