// Deliberately narrow. `PATCH /users/me`'s body schema does not declare `permitRole`, `active` or
// `email` — that allow-list IS the privilege boundary, and Elysia strips anything else before it
// reaches the database. Widening this interface would only let the client imply an edit the
// server correctly refuses. See docs/main/PROMPT-LOG.md standing rulings, 2026-08-23.
export interface IUpdateMyProfilePayload {
  firstName?: string
  lastName?: string
  phoneNumberPrefix?: string
  phoneNumber?: string
  phoneNumberExtend?: string | null
}
