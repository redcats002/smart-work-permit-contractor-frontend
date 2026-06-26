import { z } from 'zod'

export const ManagementStructureZoneManagerSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อผู้จัดการเขต')
})

export type ManagementStructureZoneManagerFormValues = z.infer<typeof ManagementStructureZoneManagerSchema>

export function useFormInitialValues (): ManagementStructureZoneManagerFormValues {
  return {
    name: ''
  }
}
