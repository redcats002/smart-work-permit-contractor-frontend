import { z } from 'zod'

export const ManagementStructureLineHeadSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อหัวหน้าสาย'),
  parentId: z
    .number()
    .min(1, 'กรุณาเลือกผู้จัดการเขต')
    .optional()
    .refine((val: number | undefined): boolean => val !== undefined, 'กรุณาเลือกผู้จัดการเขต')
})

export type ManagementStructureLineHeadFormValues = z.infer<typeof ManagementStructureLineHeadSchema>

export function useFormInitialValues (): ManagementStructureLineHeadFormValues {
  return {
    name: '',
    parentId: 0
  }
}
