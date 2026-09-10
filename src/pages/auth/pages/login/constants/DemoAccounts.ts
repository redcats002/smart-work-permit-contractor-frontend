/**
 * Demo sign-in accounts, used by DemoLoginMenu on the login page.
 *
 * ⚠ SECURITY — READ BEFORE EDITING OR COPYING THIS PATTERN
 *
 * These are REAL credentials for REAL accounts on the REAL API, and this file is compiled into
 * the production JavaScript bundle. Anyone who opens the deployed sign-in page can read these
 * passwords out of the bundle and sign in as these accounts. There is no obscurity here and no
 * privilege boundary: `view-source` is enough.
 *
 * This is a deliberate owner decision taken on 2026-09-09, which REVERSES the owner ruling of
 * 2026-09-08 recorded in wayfinder ticket 042 ("no demo environment will exist... a flag that is
 * off by default is still a route in the bundle and a password in a runbook"). It is not an
 * oversight and not leftover scaffolding — do not delete it as cleanup, and do not "harden" it
 * without asking the owner, because a half-hidden credential is worse than an openly stated one.
 *
 * What follows from that, and is the maintainer's responsibility rather than the code's:
 *
 *   - These accounts must hold NOTHING that matters. Treat every permit, certificate and audit
 *     row they can reach as public.
 *   - They must never be granted a role beyond what the demo needs, and never reused for a real
 *     person's account.
 *   - Rotating the passwords means editing this file and redeploying. There is no other store.
 *
 * The safer shape, if this is ever revisited: read them from `import.meta.env` and wrap the menu
 * in a build-time guard so the block is ABSENT from a production build rather than merely unused.
 */

export interface IDemoAccount {
  /** Stable key for `data-test` hooks and for telling entries apart in logs. */
  key: string
  labelKey: string
  email: string
  password: string
}

/**
 * This app signs in contractors only — a safety officer or inspector authenticating here is
 * refused by LoginPage's own role gate, so a second entry would be a button that always fails.
 *
 * TODO(owner): replace both placeholders with the real demo credentials. Until then the menu
 * renders and the request is made, and the API answers 401.
 */
export const DEMO_ACCOUNTS: IDemoAccount[] = [
  {
    key: 'contractor',
    labelKey: 'platform.auth.demo.contractor',
    email: 'contractor1@mail.com',
    password: 'adminadmin'
  }
]

export default DEMO_ACCOUNTS
