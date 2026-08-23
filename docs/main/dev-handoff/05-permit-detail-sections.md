# 05 — Permit Detail: the shared section contract

**Status:** normative. Both frontends implement the same sections, in the same order, with the same
field grouping. Ruled 2026-08-22 (the prompt & decision log (`PROMPT-LOG.md`), session 2, items 1.1 / 1.2): the detail
page must show **everything the user entered**, not a summary, and the two apps must not diverge.

This file is the contract that keeps them aligned. It is **copied** into each repo at the same
relative path (`docs/main/dev-handoff/05-permit-detail-sections.md`), like the other shared docs.

> Why this exists: `PMT-010` shipped a correct but *lite* detail page — banner, info card, audit
> timeline, QR. Four of the payload's richest keys (`workers`, `photos`, `jsaSteps`,
> `latestSafetyReading`) were never rendered at all, so a foreman could not see the JSA or the
> worker roster they had just filled in. If each app now fixes that independently they will invent
> two different section layouts for one permit.

---

## 1. The payload is the spec

Every section below is backed by a real key on `GET /permits/:id` → `data`. Do not invent a section
with no key behind it, and do not leave a key unrendered. The full key list, from
`smart-work-permit-api/docs/openapi.json`:

```
id type title location foreman workDate workTimeStart workTimeEnd outdoorWork status
createdById createdBy createdAt updatedAt submittedAt
approvedById approvedBy approvedAt rejectedReason rejectedAt
closedById closedBy closedAt closureChecklist
fireMonitorStartedAt qrIssuedAt entrantCount fireWatch
jsaSteps workers photos latestSafetyReading validationSummary
```

Item shapes are already modelled in both apps (contractor:
`src/models/modules/permit/Permit.model.ts` + `src/models/response/permit/PermitRes.model.ts`).
Reuse those models — do not re-declare a parallel shape.

---

## 2. Sections, in this order

Both apps use the same **six** sections and the same order. Presentation may differ (the Safety app
is mobile-first, the Contractor app desktop-first); the **grouping and the order may not**.

| # | Section | Keys it owns |
|---|---|---|
| 1 | **Overview** | `type`, `title`, `id`, `status`, `location`, `foreman`, `workDate`, `workTimeStart`, `workTimeEnd`, `outdoorWork` |
| 2 | **Safety readings** | `latestSafetyReading`, `validationSummary`, `outdoorWork` (as the bypass explanation) |
| 3 | **Workers & PPE** | `workers[]`, `photos[]` |
| 4 | **JSA** | `jsaSteps[]` |
| 5 | **Closure & Fire Watch** | `closureChecklist`, `entrantCount`, `fireWatch`, `fireMonitorStartedAt`, `closedBy`, `closedAt` |
| 6 | **Audit trail** | `GET /permits/:id/audit` |

**Lifecycle timestamps** (`createdBy`/`createdAt`, `submittedAt`, `approvedBy`/`approvedAt`,
`rejectedReason`/`rejectedAt`) belong to the **status banner + Overview**, not to a section of their
own — they are the story of the status, and the audit trail already lists them as events.

**QR** (`qrIssuedAt`) is a side panel, not a numbered section: right rail on desktop, collapsed
below the main column at narrow widths. Rendered only for `ACTIVE` / `FIRE_MONITOR` — requesting a
QR for a `DRAFT` is a guaranteed 403.

### Tabs vs. stacked

Tabs are a presentation choice, not part of this contract. Whichever you use, all six sections must
be reachable, in this order, with these names in both locales. A section whose data is empty renders
an explicit empty state — it is **never** hidden, because "no JSA rows" and "JSA not loaded" must not
look identical.

---

## 3. Section rules that are not obvious

**§2 Safety readings — render the server's verdict, never recompute it.** `validationSummary` is
`{ scope: 'safety_readings', passed, failures: [{ field, errorCode, message }] }`. Localize off
`errorCode`; never render `message`. Its scope is **readings only** — certificate gating happens at
submit and is *not* in it, so do not label it "all checks passed". `so2` is collected by the wizard
but is **not on the wire** (`GAPS` row K) — do not display a value the server never stored.

**§3 Workers & PPE.** For Confined Space, `bloodPressure` and `alcoholReading` carry the Thai
ministerial-regulation health check and must be shown with their pass/fail badge. `photos[]` is
keyed by `slotKey`; `fileRef` is a stored path, not a URL — resolve it the way the app already does
elsewhere, and show a slot that was required but never filled as explicitly missing.

**§4 JSA.** Group by `phase` (Pre / Process / Post) and order by `sortOrder` within each phase. Show
the per-phase row count.

**§5 Closure & Fire Watch.** The countdown derives from the server's `fireWatch.remainingSeconds`,
never a client-start timestamp — a page reload must not reset it. `entrantCount` is the count only;
entrant **names** are not readable here (`GAPS` row I). Closure is blocked while entrants are inside
or the Fire Watch is running, and the client must **attempt the call and render the server's
verdict** rather than pre-empting it.

**§6 Audit trail.** Append-only, hash-chained. **No edit or delete affordance anywhere, in any app.**

---

## 4. Where the two apps legitimately differ

Same data, same sections — different *actions* and different *emphasis*.

| | Contractor (owner) | Safety Officer (reviewer) |
|---|---|---|
| Actions | Edit draft, Submit, Mark complete, Close | Approve, Reject (with reason + e-signature) |
| §2 emphasis | Their own readings, with the failures they must fix | **Full review surface** — the officer decides on this screen, so every reading and every failure is shown expanded by default, not behind a "show more" |
| §3 emphasis | Roster they entered | Certificate validity per worker; a blocked worker is the reason to reject |
| Role gating | Owner-only; another contractor's permit is a 403 | Role-gated to `safety_officer` |

The Safety Officer app must **not** recompute validation client-side on the review screen — it
renders the backend's pass/fail summary. That is a standing rule, not a preference.

---

## 5. Definition of done for 1.1 / 1.2

- Every key in §1 is rendered somewhere, or has a written reason in `progress.md` why it is not.
- Section names exist in **both** locales in both apps; default UI locale is Thai.
- Timestamps display `Asia/Bangkok` (stored UTC).
- Empty sections show an explicit empty state.
- `./init.sh` green in the repo, and `node ../scripts/check-contract-sync.mjs` green.
- A narrow-width pass (375–390px) — the Safety app is mobile-first and the officer reviews in the
  field.
