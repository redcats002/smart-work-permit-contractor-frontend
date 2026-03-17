import { checkEnv } from '@/utils/EnvChecker'
import { describe, expect, it } from 'vitest'

// In Vitest, import.meta.env is a mutable object — directly set/restore values.
const env = import.meta.env as Record<string, string | undefined>

describe('checkEnv', () => {
  it('does not throw when all required env vars are set', () => {
    const original = env.VITE_APP_API_URL
    env.VITE_APP_API_URL = 'http://localhost:3000'
    try {
      expect(() => checkEnv()).not.toThrow()
    } finally {
      env.VITE_APP_API_URL = original
    }
  })

  it('throws when VITE_APP_API_URL is empty', () => {
    const original = env.VITE_APP_API_URL
    env.VITE_APP_API_URL = ''
    try {
      expect(() => checkEnv()).toThrow('Missing required environment variables')
    } finally {
      env.VITE_APP_API_URL = original
    }
  })

  it('includes the missing key name in the error message', () => {
    const original = env.VITE_APP_API_URL
    env.VITE_APP_API_URL = ''
    try {
      let message = ''
      try {
        checkEnv()
      } catch (e: any) {
        message = e.message
      }
      expect(message).toContain('VITE_APP_API_URL')
    } finally {
      env.VITE_APP_API_URL = original
    }
  })
})
