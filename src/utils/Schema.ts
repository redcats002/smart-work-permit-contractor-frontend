import z from 'zod'

interface ISchema {
  IdSchema: (label: string) => z.ZodOptional<z.ZodNumber>
  enumSchema: (enumObj: object, label: string) => z.ZodType<any, any, any>
}

const IdSchema = (label: string): z.ZodOptional<z.ZodNumber> =>
  z
    .number()
    .min(1, `กรุณาเลือก${label}`)
    .optional()
    .refine((val: number | undefined): boolean => val !== undefined, `กรุณาเลือก${label}`)

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

export const schema: ISchema = {
  IdSchema,
  enumSchema
}
