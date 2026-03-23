import z from 'zod'
import { useDayjs } from './Dayjs'

interface ISchema {
  id: (label: string) => z.ZodOptional<z.ZodType<number | string, any, any>>
  enum: (enumObj: object, label: string) => z.ZodType<any, any, any>
  date: (label: string) => z.ZodType<string, any, any>
}

const id = (label: string): z.ZodOptional<z.ZodType<number | string, any, any>> =>
  z
    .preprocess(
      (val: unknown): unknown => {
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
        return undefined
      }, z.union([z.number().min(1, `กรุณาเลือก${label}`), z.string().min(1, `กรุณาเลือก${label}`)])
    )
    .optional()
    .refine((val: number | string | undefined): boolean => val !== undefined && val !== '', `กรุณาเลือก${label}`)

const enumSchema = (enumObj: object, label: string): z.ZodType<any, any, any> =>
  z
    .preprocess(
      (value: unknown): unknown => {
        if (typeof value === 'string') return value
        if (value && typeof value === 'object' && 'id' in value) return (value as { id?: unknown }).id ?? ''
        return value ?? ''
      }, z.enum(enumObj as Readonly<Record<string, string | number>>)
    )
    .optional()
    .refine((val: string | number | undefined): boolean => val !== '', `กรุณาเลือก${label}`)

const date = (label: string): z.ZodType<string, any, any> =>
  z
    .date()
    .min(1, `กรุณาเลือก${label}`)
    .transform((val: Date): string => {
      const dayjs = useDayjs()
      const parse = dayjs(val).toISOString()
      return dayjs(val).isValid() ? parse : val.toString()
    })

export const schema: ISchema = {
  id,
  enum: enumSchema,
  date
}
