import type { IActionLoginPayload, ILoginPayload, IPreLoginPayload } from '@/models/request/auth/public/AuthReq.public.model'

export function usePreLoginPayload (data: IActionLoginPayload): IPreLoginPayload {
  return {
    email: data.email
  }
}

export function useLoginPayload (data: IActionLoginPayload): ILoginPayload {
  return {
    email: data.email,
    password: data.password
  }
}

export function useRegisterPayload (data: IActionLoginPayload): IActionLoginPayload {
  return {
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword
  }
}
