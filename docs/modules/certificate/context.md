# Module: `certificate`

Personnel safety certificates at `/certificates`, plus the gate they impose on permit
submission.

Root feature: `feat-004`. Depends on `platform` (`feat-001`). `CRT-004` also touches the
`permit` wizard, so it depends on `PMT-007`.

## Location

| Concern | Path |
|---|---|
| Routes | `src/router/modules/Certificate.router.ts` — `const prefix = '/certificates'` |
| Pages | `src/pages/certificate/pages/list/` |
| Provider | `src/resources/provider/certificate/Certificate.provider.ts` |
| Models | `src/models/{request,response}/certificate/` |

## Data model

```
{ id, workerName, role, certType, issuedDate, expiryDate, fileRef? }
```

Endpoints (`01-backend-elysia-tasks.md`):

```
GET  /certificates                  list own workers' certs
POST /certificates                  add
GET  /certificates/worker/:name     used by the entry-check flow to validate expiry
```

## Validity states

| Badge | Rule |
|---|---|
| Valid | `expiryDate` is comfortably in the future |
| Expiring soon | `expiryDate` within a threshold — **define the threshold as a named constant and confirm the window with the product owner** (neither spec states it; 30 days is the conventional default) |
| Expired | `expiryDate` is in the past |

Compare against "today" in `Asia/Bangkok`, using the existing `Dayjs` util. Do not compare
raw UTC timestamps against a local `new Date()`.

## The gate

From `00-SHARED-CONTEXT.md`:

> An expired or missing certificate for any registered worker **blocks permit submission**
> (wizard-side validation, re-checked server-side).

In this app that means: step 4 (workers) and step 6 (review) must both reflect certificate
validity, and a `CERT_EXPIRED` response from `POST /permits/:id/submit` must be surfaced and
routed back to step 4.

The second half of that rule — the Inspector's worker-badge scan denying field entry and
writing a `CERT_BLOCKED` audit entry — belongs to the **Inspector app, a different repo**.
Do not build it here.

## Screen anatomy (design lines 730-756)

Header (title + subtitle + dark add button) → 2-column card grid. Each card has a 1.5px
border tinted by validity state, worker name + role top-left, a validity badge top-right,
then a grey inner panel with `Cert type` / `Issued` / `Expiry` rows (mono dates, expiry
colored by state), and a dashed attachment row at the bottom.

## Invariants

- Provider instantiation: `const CertificateService: ICertificateProvider = new CertificateProvider()`.
- Forms use `@primevue/forms` + `zodResolver`.
- The expiring-soon threshold is one named constant, imported everywhere — never re-typed.
- Every string goes through `t()` with the `certificate.*` namespace.
