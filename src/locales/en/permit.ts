const permit = {
  status: {
    DRAFT: 'Draft',
    PENDING: 'Pending',
    REJECTED: 'Rejected',
    ACTIVE: 'Active',
    FIRE_MONITOR: 'Fire Monitor',
    CLOSED: 'Closed',
    EXPIRED: 'Expired'
  },
  type: {
    hot: 'Hot Work',
    confined: 'Confined Space',
    heights: 'Working at Heights'
  },
  wizard: {
    step: {
      1: 'Select Permit Type',
      2: 'Basic Information',
      3: 'Safety Checks',
      4: 'PPE & Workers',
      5: 'Job Safety Analysis',
      6: 'Review & Submit'
    },
    stepOf: 'Step {current} of {total}',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    // Design (SmartWorkPermit-v3.dc.html line 421) hardcodes this string in English
    // even in the Thai-first prototype, same as the "N inside" list indicator below —
    // not a truncation on our side.
    blockedNote: 'Resolve the blocked reading to continue'
  },
  list: {
    title: 'My Permits',
    subtitle: 'Track, draft and submit work permit requests',
    newPermit: 'New Permit',
    filter: {
      all: 'All'
    },
    card: {
      inside: '{count} inside'
    },
    empty: {
      title: 'No permits yet',
      description: 'Permits matching this filter will show up here once you create or submit one.'
    },
    error: {
      loadFailed: 'Could not load your permits. Please try again.'
    }
  },
  create: {
    title: 'New Permit',
    steps: {
      type: {
        marker: 'Type picker lands here — PMT-005',
        body: 'The 3-card permit-type picker (Hot Work / Confined Space / Working at Heights) is not built yet.'
      },
      basicInfo: {
        marker: 'Basic info form lands here — PMT-005',
        body: 'Project, foreman, date/time, work description and location fields are not built yet.'
      },
      safetyChecks: {
        marker: 'Safety reading fields land here — PMT-006',
        body: 'Indoor/outdoor toggle, gas reading cards and the pass/fail checklist are not built yet.'
      },
      ppeWorkers: {
        marker: 'PPE evidence and worker table land here — PMT-007',
        body: 'Photo-evidence slots and the worker roster with role chips are not built yet.'
      },
      jsa: {
        marker: 'JSA table lands here — PMT-008',
        body: 'The Pre / Process / Post job safety analysis table is not built yet.'
      },
      review: {
        marker: 'Review summary and submit land here — PMT-009',
        body: 'The read-only review summary and the submit call are not built yet.'
      }
    }
  },
  detail: {
    placeholderBadge: 'Coming soon',
    title: 'Permit Detail',
    comingSoon: 'The permit detail screen is not built yet — this is a placeholder route.'
  }
}

export default permit
