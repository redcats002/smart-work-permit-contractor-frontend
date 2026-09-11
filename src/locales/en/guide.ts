/**
 * wayfinder 077 — the "Getting started" page. Ported from and kept in step with
 * ../../../docs/guide/using-contractor-app.md, not a second, drifting copy of it (that source
 * doc is the one to update first — this file follows).
 */
const guide = {
  meta: {
    title: 'Getting started'
  },
  header: {
    title: 'Getting started',
    subtitle: 'What each part of this app is for, and how the seven-step wizard fits together.'
  },
  overview: {
    title: 'The modules',
    // wayfinder 110 — "Create permit" and "History" were cut from the drawer (the New Permit
    // wizard was always reachable from Permits' own + button; History became a view mode on that
    // same page) and "Personnel" replaced the two top-level Certificates/Workers destinations.
    // "Getting started" itself moved out of the drawer into the app bar the same round.
    intro: 'The drawer on the left has two destinations — Permits, and Personnel, which opens into Certificates and Workers. Getting started lives in the app bar, and your own profile is one tap away from the account card at the bottom.',
    modules: {
      permits: { title: 'My Permits', desc: 'Every permit you own, in any status. Open one to see its detail, edit it, or duplicate it into a new draft.' },
      newPermit: { title: 'New Permit', desc: 'The seven-step request wizard, reached from the + button on Permits — see below.' },
      history: { title: 'History', desc: 'Permits that have finished (Closed or Expired) — a read-only record with search, filters and a CSV export, reached as the "History" tab on Permits.' },
      certificates: { title: 'Certificates', desc: 'The safety cards held by the workers you send, under Personnel. A card that has expired blocks that worker at step 5 of the wizard.' },
      workers: { title: 'Workers', desc: 'The people you send, under Personnel — their certificate status and which permits they appear on, in one place.' }
    }
  },
  wizard: {
    title: 'The seven-step wizard',
    intro: 'Always seven steps, in this order, and Review is always last — no step is filtered out, and none moves depending on what has or has not been set up elsewhere in the app.',
    steps: {
      type: {
        title: '1. Type',
        desc: 'Hot Work, Confined Space, or Working at Heights. This choice drives everything after it — which safety checks appear, whether a Fire Watch is required, and which certificate the workers need.'
      },
      basicInfo: {
        title: '2. Basic info',
        desc: 'Title and foreman.'
      },
      whereWhen: {
        title: '3. Where & when',
        desc: 'The area, the pin safety placed for you to select, a location detail, the work window, and any schedule exceptions. Always renders.'
      },
      safetyChecks: {
        title: '4. Safety checks',
        desc: 'The atmosphere/wind readings your permit type requires. Out-of-range blocks Next, with no override — the server checks again at submit regardless of what the browser allowed.'
      },
      ppeWorkers: {
        title: '5. PPE & workers',
        desc: 'The PPE list, then each worker on the job. Each one is checked against a certificate that has not expired.'
      },
      jsa: {
        title: '6. JSA',
        desc: 'The job safety analysis — one row per step: phase, the step itself, the hazard, and the control.'
      },
      review: {
        title: '7. Review',
        desc: 'Everything on one screen before it leaves your hands. Saving keeps it a Draft; submitting moves it to Pending, in the safety officer\'s queue.'
      }
    }
  },
  area: {
    title: 'What is an area for?',
    p1: 'An area is the identity the system reasons about. It is what overlap warnings check against, what audit search filters on, and what a contractor is scoped to — two crews with permits on the same area are the collision this whole feature exists to catch.',
    // wayfinder 107 (superseding the 070-era description of area pre-dropping a pin you could
    // then nudge — that mechanism is gone; `Permit` has no `position` field for an area to drop
    // into any more, and the contractor never places or moves a pin).
    p2: 'The pin is a different thing: it is a position safety has already placed and named on a facility plan. You select an existing pin from the list — safety places, names and retires them, and you never place or move one yourself.',
    p3: 'The facility drawing itself stays safety-owned; a contractor does not upload their own site raster. If the shared drawing is too coarse for your work, raise it with the safety officer rather than attaching your own sketch as a workaround — a sketch attaches to the permit as a plain document, with no coordinate system.'
  },
  permitDetail: {
    title: 'Permit detail, and closing the work',
    p1: 'The detail page is where a permit lives out its life: the status banner, its own information, the safety readings, the workers and their PPE, the JSA, the QR panel, and the audit timeline.',
    p2: 'A Confined Space or Working at Heights permit closes directly from Active through the closure checklist. Hot Work must pass through a Fire Watch first — Mark complete moves it to Fire Monitor and starts the server-side countdown, then the closure checklist runs once the watch has elapsed.'
  },
  history: {
    title: 'History',
    p1: 'Finished permits only — Closed and Expired. Anything still in play lives under My Permits. Read-only, deliberately: the record of a closed permit is part of the audit trail, and the audit trail has no edit or delete path anywhere in the system.'
  },
  certificates: {
    title: 'Certificates',
    p1: 'Add a certificate from a worker you pick or register inline, then the type and the issued/expiry dates, with an optional attachment. An already-expired date is not rejected — the record is the truth, and the card simply shows as expired until it is renewed.'
  },
  workers: {
    title: 'Workers',
    p1: 'The people you send, with their certificate status and which permits they appear on. A worker is a record of their own — correcting a name here corrects it everywhere that worker appears, rather than on one certificate or permit at a time.'
  },
  profile: {
    title: 'Profile',
    p1: 'Your own account details, reached from the account card at the bottom of the drawer. Name and phone are editable; email, role and the company record are read-only.'
  }
}

export default guide
