import { ResetPasswordSchema } from '@/pages/auth/pages/reset-password/schema/reset-password.schema'
import { describe, expect, it } from 'vitest'

describe('ResetPasswordSchema', () => {
  const valid = { newPassword: 'Password1', confirmNewPassword: 'Password1' }

  it('accepts valid password pair', () => {
    const result = ResetPasswordSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('rejects newPassword shorter than 8 chars', () => {
    const result = ResetPasswordSchema.safeParse({ ...valid, newPassword: 'Pass1', confirmNewPassword: 'Pass1' })
    expect(result.success).toBe(false)
  })

  it('rejects newPassword longer than 16 chars', () => {
    const result = ResetPasswordSchema.safeParse({ ...valid, newPassword: 'Password1234567890', confirmNewPassword: 'Password1234567890' })
    expect(result.success).toBe(false)
  })

  it('rejects newPassword without uppercase letter', () => {
    const result = ResetPasswordSchema.safeParse({ ...valid, newPassword: 'password1', confirmNewPassword: 'password1' })
    expect(result.success).toBe(false)
  })

  it('rejects newPassword without number', () => {
    const result = ResetPasswordSchema.safeParse({ ...valid, newPassword: 'PasswordOnly', confirmNewPassword: 'PasswordOnly' })
    expect(result.success).toBe(false)
  })

  it('rejects empty newPassword', () => {
    const result = ResetPasswordSchema.safeParse({ ...valid, newPassword: '' })
    expect(result.success).toBe(false)
  })

  it('rejects empty confirmNewPassword', () => {
    const result = ResetPasswordSchema.safeParse({ ...valid, confirmNewPassword: '' })
    expect(result.success).toBe(false)
  })

  it('accepts when confirmNewPassword differs from newPassword (match check is resolver-level)', () => {
    const result = ResetPasswordSchema.safeParse({ newPassword: 'Password1', confirmNewPassword: 'Password2' })
    expect(result.success).toBe(true)
  })
})
