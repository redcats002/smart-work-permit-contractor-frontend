/**
 * English counterpart of src/locales/th/landing.ts — see that file's header for sourcing and for
 * why this uses named keys rather than `tm()`-read arrays.
 */
const landing = {
  meta: {
    title: 'Submit and track work permits online',
    description: 'e-safework is a permit-to-work system for a Thai industrial facility. Contractors draft, submit and track their own permits — every safety threshold is re-checked server-side, with no override.'
  },
  hero: {
    eyebrow: 'Permit-to-work system for contractors',
    title: 'Submit a work permit. Track its status in real time.',
    subtitle: 'Draft, submit and track your own work permits on the web. Every safety threshold is re-checked server-side on every submit and approval — no override, no field exception.',
    ctaPrimary: 'Sign in',
    ctaNote: 'For contractors, safety officers and field inspectors who already have an account.'
  },
  trust: {
    title: 'Numbers from the system itself',
    permitTypes: { value: '3', label: 'Permit types', sub: 'Hot Work · Confined Space · Working at Heights' },
    statuses: { value: '7', label: 'Permit lifecycle statuses', sub: 'Draft → Closed, reversible, with automatic expiry' },
    errorCodes: { value: '44', label: 'Error codes, fully localized', sub: 'Thai and English, every code' },
    timezone: { value: 'UTC', label: 'Stored in', sub: 'Displayed in Thailand time (Asia/Bangkok)' }
  },
  features: {
    title: 'Why e-safework',
    serverGates: {
      title: 'Safety thresholds are decided server-side',
      body: 'LEL / O2 / CO / wind readings are re-checked on the server on every submit and approval. An out-of-range reading is an immediate block, with no override — the client only ever renders the server\'s verdict, it never computes one.'
    },
    auditTrail: {
      title: 'An audit trail that cannot be edited after the fact',
      body: 'Every submit, approval, rejection and closure is written to an append-only audit log. There is no route to edit or delete a past entry — by design.'
    },
    offlineInspectors: {
      title: 'Inspectors keep working with no signal',
      body: 'Entrant check-in/check-out and gas readings queue on the inspector\'s device and replay once back online. Replays are idempotent, so nothing is ever recorded twice.'
    },
    liveQr: {
      title: 'A QR code tied to live status, not a snapshot',
      body: 'The QR issued on approval always resolves to the permit\'s live status — scan it to see the current state immediately, not the state at the moment it was issued.'
    },
    realFloorPlan: {
      title: 'A real floor plan, a real position',
      body: 'The safety officer pre-places named pins on a real, photographed facility floor plan. A contractor can pick a pin only while the permit is a draft or has been rejected — it locks the instant the permit is submitted.'
    }
  },
  capabilities: {
    title: 'What contractors can do here',
    draftSubmitTrack: 'Draft, submit and track their own permits',
    pickPin: 'Pick a work-location pin from the plan the safety officer placed (editable only while draft or rejected)',
    registerWorkers: 'Register workers, PPE, and a step-by-step job safety analysis (JSA)',
    requestClosure: 'Request closure once the work is done — the safety officer performs the actual closure with a checklist'
  },
  permitTypes: {
    title: 'Three permit types',
    hot: { label: 'Hot Work', rule: 'Gas readings before starting, plus a 30-minute Fire Watch after work ends' },
    confined: { label: 'Confined Space', rule: 'Atmosphere check before entry, plus a per-person entry/exit register' },
    heights: { label: 'Working at Heights', rule: 'Wind speed measured before every climb' }
  },
  lifecycle: {
    title: 'How a permit moves',
    draft: { label: 'Draft', who: 'Contractor', body: 'Fill in the job, the workers, the JSA, and pick a location pin on the plan.' },
    pending: { label: 'Pending', who: 'Waiting on the safety officer', body: 'Once submitted, safety thresholds and every worker\'s certificate are re-checked server-side.' },
    active: { label: 'Active', who: 'Approved', body: 'A QR tied to live status is issued and work can start. (A rejection instead returns it as Rejected, with a reason — revise and resubmit.)' },
    fireMonitor: { label: 'Fire Monitor', who: 'Hot Work only', body: 'Once work ends, a 30-minute Fire Watch countdown starts. The permit cannot close until it elapses.' },
    closed: { label: 'Closed', who: 'Safety officer only', body: 'Contractors and inspectors can only request closure — the safety officer performs the actual closure, with a checklist and a mandatory reason every time. Terminal status.' },
    expired: { label: 'Expired', who: 'Automatic sweep, every minute', body: 'The work window passed without closure. An Active Hot Work permit gets 30 minutes of grace before expiry — the same span as its Fire Watch, because the watch always follows work and never starts itself.' }
  },
  gates: {
    title: 'Safety gates, no exceptions',
    columns: { metric: 'Reading', limit: 'Pass range', appliesTo: 'Applies to', note: 'Note' },
    lel: { metric: 'LEL', limit: 'Must read 0%', appliesTo: 'Hot Work, Confined Space', note: 'Skippable only when flagged as outdoor work' },
    o2: { metric: 'O2', limit: '19.5–23.5%', appliesTo: 'Hot Work, Confined Space', note: 'Out of range blocks immediately' },
    co: { metric: 'CO', limit: '≤ 50 ppm', appliesTo: 'Confined Space', note: 'SO2 is logged alongside in the gas log' },
    wind: { metric: 'Wind speed', limit: '≤ 25 km/h', appliesTo: 'Working at Heights', note: 'Measured before every climb' },
    blockersTitle: 'What blocks progress, with no override',
    blockerCert: 'A worker\'s certificate is missing or expired — the permit cannot be submitted',
    blockerFireWatch: 'The 30-minute Fire Watch has not elapsed — the permit cannot be closed',
    blockerPin: 'An active facility plan exists but no location pin is selected — the permit cannot be submitted',
    blockerCloseReason: 'Closing without a stated reason is refused — and only a safety officer can close at all'
  },
  cta: {
    title: 'Ready to submit a work permit?',
    body: 'Sign in with your contractor account to draft, submit and track work permits right away.',
    button: 'Sign in'
  },
  footer: {
    note: 'e-safework — a permit-to-work system for an industrial facility'
  }
}

export default landing
