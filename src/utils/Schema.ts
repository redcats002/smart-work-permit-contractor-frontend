import type { IMedia } from '@/resources/provider/Upload.provider'
import i18n from '@/plugins/I18n.plugin'
import z from 'zod'
import { useDayjs } from './Dayjs'
import { formatter } from './Formatter'

interface ISchema {
  id: (label: string) => z.ZodOptional<z.ZodType<number | string, any, any>>
  enum: (enumObj: object, label: string) => z.ZodType<any, any, any>
  date: (label: string) => z.ZodType<string, any, any>
  media: z.ZodType<IMedia, any, any>
  richText: (label: string) => z.ZodType<string, any, any>
  numericField: (message: string) => z.ZodType<number, any, any>
}

const numericField = (message: string) => {
  return z.preprocess((value: unknown): unknown => {
    if (value == null || value === '') return ''
    if (typeof value === 'string') {
      const parsed = formatter.numberParseFloat(value)
      return Number.isNaN(parsed) ? value : parsed
    }
    return value
  }, z.number().min(0, message).default(0))
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
  const requiredMessage = i18n.global.t('common.validation.required', { label })
  const idUnion = z.union([z.number().min(1, requiredMessage), z.string().min(1, requiredMessage), z.undefined()])
  return z
    .preprocess(idPreprocess, idUnion)
    .optional()
    .refine((val: unknown): boolean => val !== undefined && val !== '', requiredMessage) as any
}
const enumSchema = (enumObj: object, label: string): z.ZodType<any, any, any> => {
  const requiredMessage = i18n.global.t('common.validation.required', { label })
  return z
    .preprocess((value: unknown): unknown => {
      if (typeof value === 'string') return value
      if (value && typeof value === 'object') {
        if ('value' in value) return (value as { value?: unknown }).value ?? ''
        if ('id' in value) return (value as { id?: unknown }).id ?? ''
      }
      return value
    }, z.enum(enumObj as Readonly<Record<string, string | number>>, requiredMessage))
    .refine((val: string | number | undefined): boolean => (val !== '' || val !== null || val !== undefined), requiredMessage)
}

const date = (label: string): z.ZodType<string, any, any> =>
  z
    .preprocess((val: unknown): unknown => {
      if (typeof val === 'string' && val !== '') {
        const d = new Date(val)
        return isNaN(d.getTime()) ? val : d
      }
      return val
    }, z.date({ message: i18n.global.t('common.validation.required', { label }) }))
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
    }, { message: i18n.global.t('common.validation.requiredField', { label }) })
  ) as z.ZodType<string, any, any>

const media = z.object({
  url: z.string().min(1, i18n.global.t('common.validation.invalidImageUrl')),
  path: z.string().min(1, i18n.global.t('common.validation.invalidImagePath')),
  name: z.string().min(1, i18n.global.t('common.validation.invalidImageName')),
  file: z
    .instanceof(File)
    .optional()
    .refine((file: File | undefined): boolean => {
      if (!file) return true
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
      return validTypes.includes(file.type)
    }, i18n.global.t('common.validation.invalidFileType')),
  isNew: z.boolean().optional()
})

export const schema: ISchema = {
  id,
  enum: enumSchema,
  date,
  media,
  richText,
  numericField
}
