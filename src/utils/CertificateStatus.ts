import { dayjs } from '@/plugins/dayjs.plugin'
import { ECertificateStatus } from '@/enums/modules/certificate/CertificateStatus.enum'

/**
 * Days before `expiryDate` a certificate flips from VALID to EXPIRING_SOON.
 *
 * PRODUCT DECISION DEFAULTED — neither `00-SHARED-CONTEXT.md` nor
 * `01-backend-elysia-tasks.md` states this window. Defaulted to 30 days per
 * docs/modules/certificate/context.md's own note ("30 days is the conventional
 * default"). Flagging for product-owner confirmation, not burying it.
 */
export const CERTIFICATE_EXPIRING_SOON_DAYS = 30

/**
 * `expiryDate` is a business/calendar date (e.g. "2026-08-13") with no time-of-day
 * of its own — read it as Bangkok **wall-clock** midnight directly. Using dayjs's
 * static `dayjs.tz(dateString, tz)` form (rather than parsing then converting) keeps
 * this independent of the host machine's own timezone: a string with no offset must
 * not be parsed as host-local time first, or the calendar day can shift.
 */
function bangkokCalendarDay (value: string | Date): dayjs.Dayjs {
  return (typeof value === 'string' ? dayjs.tz(value, 'Asia/Bangkok') : dayjs(value).tz('Asia/Bangkok')).startOf('day')
}

/**
 * `now` is a real instant (a `Date`, or an ISO string with an explicit offset/`Z`) —
 * parse it as that instant first (`dayjs(value)`, which respects the embedded offset
 * regardless of host timezone) and only then convert to its Bangkok wall-clock day.
 */
function bangkokInstantDay (value: string | Date): dayjs.Dayjs {
  return dayjs(value).tz('Asia/Bangkok').startOf('day')
}

/**
 * Pure validity classifier for a certificate's `expiryDate`.
 *
 * Compares in **Asia/Bangkok** (the facility's timezone), never the caller's
 * local/UTC clock — a cert dated "2026-08-13" has genuinely lapsed once it is
 * the 14th in Bangkok, even while it is still the 13th in UTC. `now` is a
 * required parameter (never read from the system clock internally) so this
 * stays pure and deterministic for tests.
 */
export function certificateStatus (expiryDate: string | Date, now: string | Date): ECertificateStatus {
  const today = bangkokInstantDay(now)
  const expiry = bangkokCalendarDay(expiryDate)
  const daysUntilExpiry = expiry.diff(today, 'day')

  if (daysUntilExpiry < 0) return ECertificateStatus.EXPIRED
  if (daysUntilExpiry <= CERTIFICATE_EXPIRING_SOON_DAYS) return ECertificateStatus.EXPIRING_SOON
  return ECertificateStatus.VALID
}
