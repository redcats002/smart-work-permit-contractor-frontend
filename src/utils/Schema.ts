import type { IMedia } from '@/resources/provider/Upload.provider'
import z from 'zod'
import { useDayjs } from './Dayjs'

interface ISchema {
  id: (label: string) => z.ZodOptional<z.ZodType<number | string, any, any>>
  enum: (enumObj: object, label: string) => z.ZodType<any, any, any>
  date: (label: string) => z.ZodType<string, any, any>
  media: z.ZodType<IMedia, any, any>
  richText: (label: string) => z.ZodType<string, any, any>
}

const id = (label: string): z.ZodOptional<z.ZodType<number | string, any, any>> => {
  const idPreprocess = (val: unknown): unknown => {
    if (val === null || val === undefined || val === '' || val === 0) return undefined
    if (val && typeof val === 'object' && 'id' in val) {
      const inner = (val as { id?: unknown }).id
      if (inner === null || inner === undefined || inner === '' || inner === 0) return undefined
      if (typeof inner === 'string' && inner.trim() !== '') {
        const num = Number(inner)
        return isNaN(num) ? inner : num
      }
      return inner
    }
    if (typeof val === 'string' && val.trim() !== '') {
      const num = Number(val)
      return isNaN(num) ? val : num
    }
    // Accept number 1 or greater
    if (typeof val === 'number' && val >= 1) return val
    return undefined
  }
  const idUnion = z.union([z.number().min(1, `กรุณาเลือก${label}`), z.string().min(1, `กรุณาเลือก${label}`), z.undefined()])
  return z
    .preprocess(idPreprocess, idUnion)
    .optional()
    .refine((val: unknown): boolean => val !== undefined && val !== '', `กรุณาเลือก${label}`) as any
}
const enumSchema = (enumObj: object, label: string): z.ZodType<any, any, any> =>
  z
    .preprocess((value: unknown): unknown => {
      if (typeof value === 'string') return value
      if (value && typeof value === 'object') {
        if ('value' in value) return (value as { value?: unknown }).value ?? ''
        if ('id' in value) return (value as { id?: unknown }).id ?? ''
      }
      return value
    }, z.enum(enumObj as Readonly<Record<string, string | number>>, `กรุณาเลือก${label}`))
    .refine((val: string | number | undefined): boolean => (val !== '' || val !== null || val !== undefined), `กรุณาเลือก${label}`)

const date = (label: string): z.ZodType<string, any, any> =>
  z
    .preprocess((val: unknown): unknown => {
      if (typeof val === 'string' && val !== '') {
        const d = new Date(val)
        return isNaN(d.getTime()) ? val : d
      }
      return val
    }, z.date({ message: `กรุณาเลือก${label}` }))
    .transform((val: Date): string => {
      const dayjs = useDayjs()
      const parse = dayjs(val).toISOString()
      return dayjs(val).isValid() ? parse : val.toString()
    })

const richText = (label: string): z.ZodType<string, any, any> =>
  z.preprocess(
    (val: unknown): unknown => (val === undefined || val === null ? '' : val), z.string().refine((val: string): boolean => {
      const text = val.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim()
      return text.length > 0
    }, { message: `กรุณาระบุ${label}` })
  ) as z.ZodType<string, any, any>

const media = z.object({
  url: z.string().min(1, 'URL รูปภาพไม่ถูกต้อง'),
  path: z.string().min(1, 'PATH รูปภาพไม่ถูกต้อง'),
  name: z.string().min(1, 'ชื่อรูปภาพไม่ถูกต้อง'),
  file: z
    .instanceof(File)
    .optional()
    .refine((file: File | undefined): boolean => {
      if (!file) return true
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
      return validTypes.includes(file.type)
    }, 'ไฟล์ต้องเป็นรูปภาพหรือ PDF'),
  isNew: z.boolean().optional()
})

export const schema: ISchema = {
  id,
  enum: enumSchema,
  date,
  media,
  richText
}
