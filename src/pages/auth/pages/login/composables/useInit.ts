import type { ILoginPayload } from '@/models/request/auth/public/AuthReq.public.model'

/**
 * Dev convenience — must match the stub credential in Auth.public.provider.ts.
 *
 * Gated on `import.meta.env.DEV`, NOT `useDev().isDev` (a runtime `window.location.hostname ===
 * 'localhost'` check). `isDev` is only known at request time, so both branches of a ternary
 * keyed on it are reachable and compile into every bundle, including a production one — a real
 * visitor's browser would download these two credential strings even though the autofill never
 * fires for them. `import.meta.env.DEV` is a build-time constant Vite inlines to a literal
 * `false` for `vite build`, so the bundler's minifier can prove the true branch is unreachable
 * and drop both strings entirely. `vite dev` inlines `true`, so local autofill is unchanged.
 */
export function useInitForm (): ILoginPayload {
  return {
    email: import.meta.env.DEV ? 'smoke.contractor@example.com' : '',
    password: import.meta.env.DEV ? 'password123' : ''
  }
}
