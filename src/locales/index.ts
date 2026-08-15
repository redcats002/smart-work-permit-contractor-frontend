import en from '@/locales/en'
import th from '@/locales/th'

export type TLocale = 'en' | 'th'
export type TMessageSchema = typeof en

export const LOCALES: TLocale[] = ['en', 'th']

export const messages: Record<TLocale, TMessageSchema> = { en, th }

export default messages
