import z from 'zod'

interface ISchema {
  IdSchema: (label: string) => z.ZodOptional<z.ZodNumber>
}

const IdSchema = (label: string): z.ZodOptional<z.ZodNumber> => z
  .number()
  .min(1, `กรุณาเลือก${label}`)
  .optional()
  .refine((val: number | undefined): boolean => val !== undefined, `กรุณาเลือก${label}`)


export const schema: ISchema = {
  IdSchema
}
