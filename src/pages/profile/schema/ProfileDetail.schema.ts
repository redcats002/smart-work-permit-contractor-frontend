import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'

/**
 * wayfinder ticket 006 — owner ruling 2026-08-31 ("Add zod first, then convert. Do not swap them
 * bare."). `ProfileDetailPage.vue` had no client-side validation schema before this file; its only
 * validation was the native `<input>` attributes (`required` on name fields, `minlength`/
 * `maxlength="10"` on phone) that a bare Volt `InputText` swap would silently drop.
 *
 * Mirrors `PATCH /users/me`'s body schema (docs/api/openapi.json): `firstName`/`lastName` are
 * `minLength: 1`, `phoneNumber` is `minLength: 10, maxLength: 10`. `phoneNumber` stays OPTIONAL
 * here, not required — a contractor who never filled it in must still be able to save a name
 * change, and the page already omits an empty phone from the payload rather than sending an
 * invalid one (`ProfileDetailPage.vue`'s `save()`). So the schema validates length only when the
 * field is non-empty; it never turns an unrelated save into a hard block on a field nobody asked
 * this contractor to fill in.
 */
export const ProfileDetailSchema = z.object({
  firstName: z.string().min(1, i18n.global.t('profile.validation.firstNameRequired')),
  lastName: z.string().min(1, i18n.global.t('profile.validation.lastNameRequired')),
  phoneNumber: z.string().refine(
    (value: string): boolean => value === '' || value.length === 10, i18n.global.t('profile.validation.phoneLength')
  ),
  phoneNumberExtend: z.string()
})

export type TProfileDetailFormValues = z.infer<typeof ProfileDetailSchema>

export function useProfileDetailInitialValues (): TProfileDetailFormValues {
  return { firstName: '', lastName: '', phoneNumber: '', phoneNumberExtend: '' }
}

export default ProfileDetailSchema
