#!/usr/bin/env node
// Live contract smoke check (API-009).
//
// `./init.sh` only proves the app agrees with its own types. This proves the shapes the real
// backend sends still match what the providers expect — the contractor slice of them.
//
//   node scripts/smoke-api.mjs
//   API_URL=… SMOKE_EMAIL=… SMOKE_PASSWORD=… node scripts/smoke-api.mjs
//
// Needs a CONTRACTOR account. The API seeds a safety_officer bootstrap account only; provision a
// contractor with POST /api/v1/users while signed in as that officer (04-api-contract.md §2).
//
// Exits 0 and skips loudly when no API is reachable, so it is safe to run offline.
//
// SCOPE, and it matters: this script exercises READ paths only. It is not, and cannot be, evidence
// that write paths still work. Wayfinder 060 made that concrete — a worker became an entity and
// every write path moved to `workerId`, while responses kept echoing `workerName` for display, so
// this whole script stayed green against an API the app could no longer POST to. If you are
// verifying a contract change that touches request bodies, this gate does not cover you.

const API_URL = process.env.API_URL ?? 'http://localhost:3000'
const EMAIL = process.env.SMOKE_EMAIL ?? 'smoke.contractor@example.com'
const PASSWORD = process.env.SMOKE_PASSWORD ?? 'password123'
const BASE = `${API_URL}/api/v1`

let cookie = ''
const failures = []

function check (name, condition, detail) {
  if (condition) {
    console.info(`  ok   ${name}`)
    return
  }
  failures.push(name)
  console.error(`  FAIL ${name}`)
  if (detail !== undefined) console.error(`       got: ${JSON.stringify(detail).slice(0, 400)}`)
}

async function call (method, path, body) {
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...cookie ? { Cookie: cookie } : {} },
    body: body ? JSON.stringify(body) : undefined
  })
  const text = await response.text()
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = text
  }
  return { status: response.status, body: parsed, setCookie: response.headers.getSetCookie?.() ?? [] }
}

const isEnvelope = (body) =>
  body && typeof body === 'object' && body.message === 'success' && 'data' in body

async function main () {
  try {
    await fetch(API_URL, { signal: AbortSignal.timeout(2000) })
  } catch {
    console.info(`SKIP: no API reachable at ${API_URL} — start it with \`cd ../smart-work-permit-api && bun run dev\``)
    process.exit(0)
  }

  console.info(`smoke: ${BASE}`)

  console.info('auth')
  const login = await call('POST', '/auth/user/public/login', { email: EMAIL, password: PASSWORD })
  check('login returns 200', login.status === 200, login.body)
  if (login.status !== 200) {
    console.error(`\nCannot continue without a session. Provision a contractor account, or pass SMOKE_EMAIL/SMOKE_PASSWORD.`)
    process.exit(1)
  }
  check('login answers { success, data: { token, user } } — NOT the message/data envelope',
    login.body?.success === true && typeof login.body?.data?.token === 'string' && !!login.body?.data?.user,
    login.body)
  check('the account is a contractor — this app 403s on every screen otherwise',
    login.body?.data?.user?.role === 'contractor', login.body?.data?.user)
  cookie = login.setCookie.map((entry) => entry.split(';')[0]).join('; ')
  check('login sets a session cookie', cookie.length > 0, login.setCookie)

  console.info('errors')
  const unauth = await fetch(`${BASE}/permits`).then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }))
  check('no session -> 401 JSON { code, message, errorCode }',
    unauth.status === 401 && unauth.body?.code === 401 && typeof unauth.body?.errorCode === 'string', unauth.body)

  const missing = await call('GET', '/permits/NO-SUCH-PERMIT')
  check('unknown permit -> 404 { code: 404 } and no errorCode — its absence is normal',
    missing.status === 404 && missing.body?.code === 404 && missing.body?.errorCode === undefined, missing.body)

  const forbidden = await call('GET', '/audit')
  check('a safety-officer-only route -> 403 FORBIDDEN_ROLE for a contractor',
    forbidden.status === 403 && forbidden.body?.errorCode === 'FORBIDDEN_ROLE', forbidden.body)

  console.info('permits')
  const list = await call('GET', '/permits')
  check('permit list is the paginated envelope', isEnvelope(list.body)
    && Array.isArray(list.body.data)
    && ['count', 'page', 'limit', 'totalPage'].every((key) => typeof list.body[key] === 'number'), list.body)

  const first = list.body?.data?.[0]
  if (first) {
    check('permit row carries createdBy as an object (or null), not a name string',
      first.createdBy === null || typeof first.createdBy === 'object', first)
    check('permit row has no `project` or `workDescription` — those fields do not exist',
      first.project === undefined && first.workDescription === undefined, Object.keys(first))

    const detail = await call('GET', `/permits/${encodeURIComponent(first.id)}`)
    const permit = detail.body?.data
    check('permit detail carries jsaSteps/workers/photos/latestSafetyReading',
      Array.isArray(permit?.jsaSteps) && Array.isArray(permit?.workers) && Array.isArray(permit?.photos)
      && 'latestSafetyReading' in (permit ?? {}), Object.keys(permit ?? {}))

    const audit = await call('GET', `/permits/${encodeURIComponent(first.id)}/audit`)
    check('permit audit is enveloped and path-scoped', isEnvelope(audit.body) && Array.isArray(audit.body.data), audit.body)
  } else {
    console.info('  note: no permits for this account — row-level shape checks skipped')
  }

  console.info('certificates + notifications')
  const certificates = await call('GET', '/certificates')
  check('certificates are paginated and rows carry the computed `expired` flag',
    isEnvelope(certificates.body) && typeof certificates.body.totalPage === 'number'
    && (certificates.body.data.length === 0 || typeof certificates.body.data[0].expired === 'boolean'),
    certificates.body)
  // wayfinder 060 — `workerName` is still echoed on the response for display, but identity is
  // `workerId` now, and asserting only the name is what let this check stay green while every
  // write path was broken. Both are required: the name because the UI renders it without joining,
  // the id because that is what the app must send back.
  check('a certificate row carries workerId (identity) and echoes workerName (display)',
    certificates.body?.data?.length === 0
    || (certificates.body?.data?.[0]?.workerId !== undefined && certificates.body?.data?.[0]?.workerName !== undefined),
    certificates.body?.data?.[0])

  const notifications = await call('GET', '/notifications')
  check('notifications are paginated (feat-011c) — same envelope shape as certificates',
    isEnvelope(notifications.body) && Array.isArray(notifications.body.data)
    && typeof notifications.body.totalPage === 'number' && typeof notifications.body.page === 'number'
    && typeof notifications.body.limit === 'number' && typeof notifications.body.count === 'number',
    notifications.body)

  console.info('')
  if (failures.length > 0) {
    console.error(`${failures.length} shape mismatch(es): ${failures.join(', ')}`)
    process.exit(1)
  }
  console.info('all contract checks passed')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
