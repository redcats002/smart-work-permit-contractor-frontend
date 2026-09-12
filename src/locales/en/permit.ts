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
      3: 'Where & When',
      4: 'Safety Checks',
      5: 'PPE & Workers',
      6: 'Job Safety Analysis',
      7: 'Review & Submit'
    },
    stepOf: 'Step {current} of {total}',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    // Design (SmartWorkPermit-v3.dc.html line 421) hardcodes this string in English
    // even in the Thai-first prototype, same as the "N inside" list indicator below —
    // not a truncation on our side.
    blockedNote: 'Complete the required fields on this step to continue',
    // wayfinder ticket 033 — the explicit "Save as Draft" action, distinct from the debounced
    // autosave that already runs on every field edit (no confirmation on that — see ticket).
    saveDraft: {
      action: 'Save as Draft',
      title: 'Save as draft?',
      body: 'This permit will be saved as a draft and you can come back to finish it later.',
      confirm: 'Save Draft',
      cancel: 'Cancel'
    }
  },
  list: {
    title: 'My Permits',
    subtitle: 'Track, draft and submit work permit requests',
    newPermit: 'New Permit',
    searchPlaceholder: 'Search ID, title, location',
    // wayfinder 110 — History was cut from the menu; its table/filters/CSV export now live here
    // as the "History" view mode, so the same page answers both "what's live" and "what's closed".
    viewMode: {
      permits: 'Permits',
      history: 'History'
    },
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
    },
    // wayfinder 077 — the first-run checklist, per-user dismissible. Ticked state derives from
    // real data (workers/certificates/permit list), never a client-side flag alone.
    checklist: {
      title: 'Getting started',
      dismiss: 'Dismiss',
      registerWorkers: 'Register your workers',
      uploadCertificates: 'Upload their certificates',
      createFirstPermit: 'Create your first permit'
    }
  },
  create: {
    title: 'New Permit',
    editTitle: 'Edit Permit',
    duplicateTitle: 'Duplicate & Edit',
    resuming: 'Loading your draft…',
    duplicating: 'Duplicating this permit…',
    notEditable: {
      title: 'This permit can no longer be edited',
      back: 'Back to permit'
    },
    steps: {
      type: {
        prompt: 'Choose the type of work this permit covers',
        field: 'Permit Type',
        blurb: {
          hot: 'Welding, cutting, grinding, or any work producing sparks, flame, or heat.',
          confined: 'Tanks, vessels, pits, or any enclosed space with restricted entry and limited airflow.',
          heights: 'Work performed above ground level or a permanent platform.'
        }
      },
      basicInfo: {
        field: {
          title: 'Project',
          contractor: 'Contractor',
          foreman: 'Foreman'
        }
      },
      // wayfinder 107/121 — "Where & when" (step 3): the safety-placed pin, the location detail
      // (moved from Basic Info), dates, schedule note. Geo coordinate (070) is gone — 105 removed
      // Permit.latitude/longitude from the wire; the area picker is gone — 121 removed Area.
      whereWhen: {
        subtitle: 'Where this work happens, and when — select the pin safety placed for it.',
        field: {
          startDate: 'Start Date',
          endDate: 'End Date',
          dailyStart: 'Daily Start Time',
          dailyEnd: 'Daily End Time',
          locationDetail: 'Location Detail',
          scheduleNote: 'Schedule / Location Note'
        },
        scheduleNote: {
          placeholder: 'Exceptions the dates above cannot express — e.g. "Not working Sat/Sun"'
        },
        pin: {
          planLabel: 'Facility Plan',
          planPlaceholder: 'Select a facility plan',
          noPlans: 'No facility plans have been added yet.',
          pinLabel: 'Pin',
          pinPlaceholder: 'Select a pin safety has placed',
          noPins: 'No active pins on this plan yet.',
          retiredLabel: 'Current pin (retired)',
          retiredNote: 'This permit already uses this pin. It is no longer active, or its plan has been retired, so it is not in the selectable list.',
          missingNote: 'This permit referenced a pin that could not be found.',
          imageLoadFailed: 'The facility plan image could not be loaded. Try again in a moment.',
          retry: 'Retry',
          alt: 'Facility plan with the selected pin marked',
          required: 'A pin is required before this permit can be submitted.'
        },
        validation: {
          endDateNotBeforeStart: 'End date cannot be before start date',
          endAfterStart: 'Daily end time must be after daily start time'
        }
      },
      safetyChecks: {
        subtitle: 'All readings are validated server-side. Out-of-range values block approval — there is no override.',
        safe: 'Atmosphere within safe limits.',
        serverRejected: {
          title: 'The server rejected these readings when you submitted'
        },
        blocked: {
          title: 'PERMIT BLOCKED — READING OUT OF RANGE',
          noOverride: 'Correct the reading to continue. There is no override — the backend rejects the same values at submit.'
        },
        failure: {
          missing: '{reading} has not been recorded.',
          outOfRange: '{reading} is outside the permitted range.'
        },
        hint: {
          range: '{min} – {max}{unit}',
          atMost: '≤ {max} {unit}',
          exact: 'Must read {max}{unit}',
          above: '> {min} {unit} triggers extra checks',
          none: 'No limit'
        },
        reading: {
          lel: 'Flammable gas / LEL',
          o2: 'Oxygen / O₂',
          co: 'Carbon monoxide / CO',
          so2: 'Sulphur dioxide / SO₂',
          wind: 'Wind speed (anemometer)',
          height: 'Height from ground'
        },
        section: {
          atmosphere: 'Atmosphere Check',
          environmental: 'Environmental Reading',
          checklist: 'Safety Checklist'
        },
        outdoor: {
          question: 'Atmosphere check required?',
          hint: 'Bypass only when working fully outdoors in open air',
          indoorActive: 'Indoor — test required',
          bypassed: 'Atmosphere check bypassed — outdoor work',
          bypassedBody: 'Gas readings are not required for open-air locations. The Safety Officer verifies site conditions on-site.',
          switchToIndoor: 'Switch to indoor — add gas test'
        },
        answer: {
          yes: 'Yes',
          no: 'No',
          na: 'N/A'
        },
        checklistSavedWithDraft: 'A pre-work reference aid — saved automatically with your draft, but it does not affect whether you can submit.',
        photo: {
          instrument: 'Instrument photo',
          uploading: 'Uploading…',
          replace: 'Tap to replace'
        },
        checklist: {
          hot: {
            1: 'Pipe isolation / barricading',
            2: 'Lockout / tagout completed',
            3: 'Fuel removed / openings sealed',
            4: 'Fire Watcher assigned & present',
            5: 'Wheeled fire extinguisher ready',
            6: 'Spark guard / screen in place',
            7: 'Atmosphere test completed + photo',
            8: 'Area clear of all flammables',
            9: 'Welding equipment earthed',
            10: 'Tools inspected before use',
            11: 'PPE worn correctly by all workers',
            12: 'Emergency escape route clear',
            13: 'Fixed suppression system isolated',
            14: 'Adjacent areas notified',
            15: 'Warning signs posted at perimeter',
            16: 'Electrical cables inspected',
            17: 'Pre-work inspection log signed'
          },
          confined: {
            1: 'Tools & equipment safe for entry',
            2: 'Electrical de-energized & locked',
            3: 'All valves blanked / locked out',
            4: 'Atmosphere safe for entry',
            5: 'Attendant stationed outside entry',
            6: 'Rescue equipment ready at entry',
            7: 'Communication system established',
            8: 'Lighting adequate for all tasks',
            9: 'Lifeline attached to each entrant',
            10: 'Emergency breathing apparatus ready',
            11: 'Emergency exit unobstructed',
            12: 'Rescue team on standby',
            13: 'Entry permit counter-signed by SO'
          },
          heights: {
            1: 'Scaffolding installed & inspected',
            2: 'Guardrails installed at 90–110 cm',
            3: 'Anchor points established',
            4: 'Work area barricaded below',
            5: 'Surface free of water / slip hazard',
            6: 'Safety watcher assigned full-time',
            7: 'Wind speed checked < 25 km/h',
            8: 'Full-body harness worn & inspected',
            9: 'Drop-hazard zone fenced',
            10: 'Blood pressure checked for all workers',
            11: 'Tools tethered to prevent drops',
            12: 'Scaffolding tag current & attached',
            13: 'Weather forecast checked for shift',
            14: 'Emergency descent route unobstructed'
          }
        }
      },
      ppeWorkers: {
        subtitle: 'Confirm PPE and register workers. Photo evidence is required where marked.',
        evidenceTitle: 'Required Photo Evidence',
        attach: 'Attach photo',
        slot: {
          'fire-extinguisher': 'Fire extinguisher on-site',
          'gas-detector': 'Gas detector display',
          'fire-watcher': 'Fire Watcher present',
          'rescue-equipment': 'Rescue equipment',
          'entry-point': 'Entry point setup',
          'harness': 'Harness at work location',
          'scaffold-tag': 'Scaffolding tag (readable)',
          'anemometer': 'Anemometer display',
          'worksite': 'Worksite overview'
        },
        // wayfinder 097 — the PPE checklist + note. Optional to submit (no client gate beyond
        // the server's own `PPE_REQUIRED` flag, off by default and not modelled by this app).
        ppe: {
          title: 'PPE Worn',
          optionalHint: 'Optional — check off what will be worn on this job. The server may require this if the facility turns on mandatory PPE declaration.',
          item: {
            'safety-glasses': 'Safety Glasses',
            'hardhat': 'Hardhat',
            'respiratory-protection': 'Respiratory Protection',
            'earmuffs': 'Earmuffs',
            'construction-vest': 'Construction Vest',
            'gloves': 'Gloves',
            'protective-boots': 'Protective Boots'
          },
          noteLabel: 'Note (optional)',
          notePlaceholder: 'Anything else about the PPE for this job'
        },
        regulation: {
          title: 'Pre-Work Health Check (Required)',
          body: 'ตามกฎกระทรวงการบริหาร จัดการ และดำเนินการด้านความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงานเกี่ยวกับปัจจัยเสี่ยง กำหนดให้ตรวจวัดความดันโลหิตและระดับแอลกอฮอล์ในเลือดก่อนอนุญาตเข้าปฏิบัติงานทุกครั้ง — ห้ามผู้มีระดับแอลกอฮอล์เกิน 0 มก.% หรือความดันผิดปกติเข้าปฏิบัติงาน'
        },
        workersTitle: 'Workers ({count})',
        addWorker: 'Add Worker',
        addCertificate: 'New Certificate',
        removeWorker: 'Remove worker',
        noWorkers: 'No workers registered yet. Add everyone who will be on this permit.',
        // wayfinder ticket 004 — worker-name AutoComplete suggestion item copy. A name matching
        // no suggestion stays legal free text; "empty" tells the contractor that, not that they
        // are blocked.
        suggestion: {
          expired: 'Expired',
          empty: 'No certificate matches — you can still type this worker\'s name.'
        },
        column: {
          worker: 'Worker',
          role: 'Role on permit',
          certificate: 'Certificate',
          bloodPressure: 'Blood pressure',
          alcohol: 'Alcohol',
          result: 'Result'
        },
        placeholder: {
          worker: 'Full name',
          role: 'Choose from the list or type a role',
          bloodPressure: '120/80',
          alcohol: '0.00'
        },
        role: {
          'fire-watcher': 'Fire Watcher',
          'operator': 'Operator',
          'helper': 'Helper',
          'entrant': 'Entrant',
          'attendant': 'Attendant',
          'gas-tester': 'Gas Tester',
          'worker': 'Worker',
          'scaffold-inspector': 'Scaffold Inspector',
          'safety-watcher': 'Safety Watcher',
          'supervisor': 'Supervisor'
        },
        health: {
          pass: '✓ Pass',
          fail: '✗ Fail'
        },
        // CRT-004 — client-side worker-certificate pre-flight badge (step 4). 'checking'/'unknown'
        // never gate Next; only a confirmed 'missing'/'expired' does (see useWizard.isNextBlocked).
        certificate: {
          checking: '… Checking',
          pass: '✓ Valid',
          missing: '✗ Missing',
          expired: '✗ Expired',
          unknown: '? Unchecked'
        },
        certificatePreflight: {
          title: 'These workers need a valid certificate before you can continue'
        },
        serverRejected: {
          title: 'The server refused these workers when you submitted'
        },
        healthBlocked: 'One or more workers fail the health check — the permit cannot be submitted until this is resolved.',
        validation: {
          incompleteRow: 'Every worker needs a name and a role before you can continue.',
          healthFailed: '{worker} did not pass the pre-work health check.'
        },
        remove: {
          title: 'Remove this worker?',
          description: 'They will be taken off this permit.',
          confirm: 'Yes, remove'
        }
      },
      jsa: {
        subtitle: 'Break the job into phases, identify the hazards in each, and define the controls.',
        phase: {
          pre: 'Pre-Work',
          process: 'During Work',
          post: 'Post-Work'
        },
        column: {
          step: 'Work Step',
          hazard: 'Hazard',
          control: 'Control'
        },
        placeholder: {
          step: 'What happens in this step',
          hazard: 'What could go wrong',
          control: 'How it is prevented'
        },
        addRow: 'Add step to {phase}',
        removeRow: 'Remove step',
        emptyPhase: 'No steps in this phase yet.',
        validation: {
          incompleteRow: 'Every JSA step needs a work step, a hazard and a control.'
        },
        remove: {
          title: 'Remove this JSA step?',
          description: 'It will be taken off this permit.',
          confirm: 'Yes, remove'
        }
      },
      review: {
        subtitle: 'Confirm every detail. Submitting notifies the Safety Officer for review.',
        idPending: 'ID pending',
        field: {
          dateTime: 'Date / Time',
          pin: 'Pin',
          scheduleNote: 'Schedule / Location Note',
          workers: 'Workers',
          jsaSteps: 'JSA Steps'
        },
        pinNotSet: 'Not selected',
        workersCount: '{count} registered',
        jsaCount: '{count} defined',
        check: {
          atmospherePass: 'Atmosphere readings are within safe limits',
          atmosphereBypassed: 'Atmosphere check bypassed — outdoor work',
          atmosphereFail: 'A required reading is missing or out of range — go back to Safety Checks',
          evidencePass: 'All required photo evidence is attached',
          evidenceFail: 'Some required photo evidence is still missing',
          certificate: {
            loading: 'Checking worker certificates…',
            pass: 'Worker certificates are valid and not expired',
            fail: 'Certificate missing or expired for: {workers}',
            unknown: 'Worker certificates could not be checked — the server decides at submit'
          }
        }
      }
    }
  },
  detail: {
    title: 'Permit Detail',
    back: 'My Permits',
    loadFailed: 'Could not load this permit',
    notFound: 'This permit is not available',
    // wayfinder 113 / ruling 11 — the fixed strip above the tabs. Absent from the DOM entirely
    // when nothing is urgent; see PermitUrgentSection.vue for what puts an entry here.
    urgent: {
      closeRequested: {
        title: 'Closure requested — awaiting Safety Officer',
        body: 'Requested by {who} on {when}.',
        reasonPrefix: 'Reason: ',
        role: {
          contractor: 'you',
          inspector: 'the inspector',
          safety_officer: 'the Safety Officer',
          unknown: 'someone on this permit'
        }
      }
    },
    // PMT-013 — the six sections of docs/main/dev-handoff/05-permit-detail-sections.md §2, in order.
    sections: {
      overview: {
        title: '1. Overview',
        environment: 'Work environment',
        outdoor: 'Outdoor — gas checks bypassed by the server',
        indoor: 'Indoor / enclosed area',
        lifecycle: 'Status history',
        createdBy: 'Created by',
        createdAt: 'Created',
        updatedAt: 'Last updated',
        submittedAt: 'Submitted',
        approvedBy: 'Approved by',
        approvedAt: 'Approved',
        rejectedAt: 'Rejected',
        rejectedReason: 'Rejection reason',
        none: '—'
      },
      safety: {
        title: '2. Safety readings',
        empty: 'No safety reading has been recorded for this permit yet.',
        recordedAt: 'Recorded {when}',
        recordedAtUnknown: 'Recording time not available',
        passed: 'Server verdict: safety readings passed',
        failed: 'Server verdict: safety readings failed',
        scopeNote: 'This verdict covers the atmosphere and wind readings only. Worker certificates are checked separately at submit.',
        outdoorBypass: 'This permit is flagged as outdoor work, so the server skips the LEL / O₂ / CO checks.',
        notRecorded: 'Not recorded'
      },
      workers: {
        title: '3. Workers & PPE',
        rosterTitle: 'Worker roster ({count})',
        empty: 'No workers have been registered on this permit yet.',
        columnNo: '#',
        columnWorker: 'Worker',
        columnRole: 'Role on permit',
        columnBloodPressure: 'Blood pressure',
        columnAlcohol: 'Alcohol (mg%)',
        columnHealth: 'Health check',
        healthPass: '✓ Pass',
        healthFail: '✗ Fail',
        healthIssueBloodPressure: 'Blood pressure outside the safe range',
        healthIssueAlcohol: 'Alcohol reading missing or above 0 mg%',
        // wayfinder 097 — declared PPE, rendered next to the roster it belongs with.
        ppeTitle: 'PPE declared',
        ppeEmpty: 'No PPE has been declared on this permit.',
        photosTitle: 'Photo evidence',
        photosEmpty: 'No photo evidence has been attached to this permit.',
        photoMissing: 'Required — not attached',
        photoOther: 'Additional attachment',
        photoOpen: 'Open file',
        photoOpenFailed: 'Could not open this file'
      },
      jsa: {
        title: '4. Job Safety Analysis',
        empty: 'No JSA steps have been recorded for this permit.',
        phaseCount: '{count} step(s)',
        phaseEmpty: 'No steps in this phase.',
        columnStep: 'Work step',
        columnHazard: 'Hazard',
        columnControl: 'Control'
      },
      closure: {
        title: '5. Closure & Fire Watch',
        // wayfinder ticket 047 — heading for a permit type that can never hold a Fire Watch.
        titleClosureOnly: '5. Closure',
        empty: 'This permit has not been closed yet. The closure checklist appears here once it is closed.',
        checklistTitle: 'Closure checklist',
        closedBy: 'Closed by',
        closedAt: 'Closed',
        answerYes: 'Yes',
        answerNo: 'No',
        answerNa: 'N/A',
        entrantCount: 'Entrants currently inside',
        // docs/api/GAPS.md row I — only the count is exposed to a contractor.
        entrantNames: 'Entrant names are not readable from the contractor app — only the count is exposed.',
        fireWatchTitle: 'Fire Watch',
        fireWatchStartedAt: 'Fire Watch started',
        fireWatchRemaining: 'Remaining (server-side)',
        fireWatchElapsed: 'Fire Watch complete — closure is unlocked',
        fireWatchNone: 'No Fire Watch has been started for this permit.'
      },
      audit: {
        title: '6. Audit trail'
      },
      // wayfinder 112 — the seventh tab. Map ruling 18: a contractor reads the FULL content on
      // their own permits, inspector notes included.
      report: {
        title: '7. Report'
      }
    },
    banner: {
      // Design (SmartWorkPermit-v3.dc.html lines 434-458) — one variant per status.
      actionUnavailable: 'Editing an existing permit is not available yet.',
      draft: {
        title: 'Draft Permit',
        description: 'Not yet submitted. Edit and complete all sections, then submit for Safety Officer review.',
        action: 'Edit Permit →'
      },
      rejected: {
        title: 'Permit Rejected',
        noReason: 'No reason was recorded.',
        meta: 'Rejected by: {who} · Immutable — logged to audit trail',
        action: 'Duplicate & Edit'
      },
      pending: {
        title: 'Pending Review',
        description: 'Awaiting Safety Officer review. Editing now withdraws it from review and returns it to Draft — you will need to submit it again.',
        action: 'Edit Permit'
      },
      submitted: {
        title: 'Permit submitted successfully',
        description: 'The Safety Officer has been notified. You will receive your QR code once the permit is approved.'
      },
      active: {
        title: 'Work Active',
        description: 'This permit is approved and in force. Show the QR code at the worksite for inspection.'
      },
      activeHot: {
        title: 'Hot Work Active',
        description: 'When welding or cutting is complete, start the mandatory 30-minute Fire Watch countdown before closing.'
      },
      closed: {
        title: 'Permit Closed',
        description: 'This permit is closed. It is read-only and kept in the audit trail.',
        descriptionAt: 'Closed on {when}. This permit is read-only and kept in the audit trail.'
      }
    },
    info: {
      location: 'พื้นที่ / Location',
      foreman: 'ผู้ควบคุมงาน / Foreman',
      date: 'วันที่ / Date',
      time: 'เวลา / Time'
    },
    audit: {
      title: 'Audit Timeline · Who / What / When',
      empty: 'No audit entries yet.',
      // The log is an append-only, server-signed hash chain — this app never offers edit or delete.
      readOnly: 'Read-only — the audit log is append-only and cannot be edited or deleted.',
      unknownActor: 'System',
      // 2026-09-12 owner-filed issue 1 — the complete closed set `writeAuditLog` actually writes
      // for a permit-scoped row (`smart-work-permit-api`'s permit module). `USER_CREATED` /
      // `USER_UPDATED` / `USER_DEACTIVATED` / `USER_REACTIVATED` are deliberately absent: those
      // are user-scoped rows with `permitId: null`, and `PermitAuditService.execute` filters
      // `findMany({ where: { permitId } })`, so they can never reach this timeline. `DEMO_LOGIN`
      // is a retired feature (wayfinder 042) but the log is append-only, so an old row can still
      // carry it — it gets a label rather than falling back to the raw enum forever.
      action: {
        PERMIT_SUBMITTED: 'Permit submitted',
        PERMIT_APPROVED: 'Permit approved',
        PERMIT_REJECTED: 'Permit rejected',
        PERMIT_WITHDRAWN_FOR_EDIT: 'Withdrawn from review for editing — returned to Draft',
        PERMIT_MARKED_COMPLETE: 'Work marked complete — Fire Watch started',
        PERMIT_CLOSED: 'Permit closed',
        PERMIT_CLOSE_REQUESTED: 'Closure requested',
        PERMIT_EXPIRED: 'Permit expired',
        ENTRANT_CHECKED_IN: 'Worker checked in',
        ENTRANT_CHECKED_OUT: 'Worker checked out',
        GAS_LOG_RECORDED: 'Gas reading recorded',
        CERT_BLOCKED: 'Entry blocked — certificate invalid',
        WORKER_MARKED_NOT_AVAILABLE: 'Worker marked not available',
        DEMO_LOGIN: 'Demo login (retired)'
      }
    },
    closure: {
      // Design lines 574-611. `start` is Hot Work's "Mark Work Complete" trigger only now — the
      // sibling "Close Permit" trigger moved to `requestClose.start` below (wayfinder 098). `item`
      // is still read by `PermitClosureSection.vue` to label the checklist Safety recorded at
      // close; the rest of this block (title/subtitle/answerYes/answerNo/cancel/confirm/
      // submitting/signature/blocked) belonged only to the retired contractor-side
      // `ClosureChecklistModal` and is gone with it.
      start: 'Mark Work Complete →',
      item: {
        entrantsExited: 'ผู้ปฏิบัติงานทุกคนออกจากพื้นที่แล้ว / All entrants safely exited',
        worksiteRestored: 'พื้นที่ทำงานกลับสู่สภาพปกติ / Worksite restored to normal',
        equipmentRemoved: 'อุปกรณ์ทั้งหมดถูกนำออกจากพื้นที่ / Equipment removed from area',
        entryPointSealed: 'ปิดช่องทางเข้า / กลับสู่สภาพเดิม / Entry point sealed & restored',
        barricadesRemoved: 'รื้อกั้นพื้นที่ / ป้ายเตือน / Barricades & signs removed',
        workersDescended: 'ผู้ปฏิบัติงานทุกคนลงมาอย่างปลอดภัย / All workers descended safely',
        scaffoldingSecured: 'นั่งร้านรักษาความปลอดภัยหรือรื้อถอน / Scaffolding secured or removed',
        areaBelowCleared: 'พื้นที่ด้านล่างเปิดใหม่ / Area below cleared & re-opened',
        documentationCompleted: 'บันทึกเสร็จสมบูรณ์ / Documentation completed'
      }
    },
    // wayfinder 098 (reopened 2026-09-11) — replaces the retired ClosureChecklistModal. The
    // contractor no longer closes a permit; this raises a request for the Safety Officer, who
    // reviews and closes it (or comes back with what is still outstanding).
    requestClose: {
      start: 'Request Closure →',
      again: 'Update Request',
      title: 'Request Closure',
      subtitle: 'Let the Safety Officer know this permit is ready to close. They will review it and close it, or come back to you if anything is still outstanding.',
      alreadyRequested: 'A closure request is already awaiting the Safety Officer. Sending again refreshes it with whatever you enter here.',
      field: {
        reason: 'Reason (optional)',
        reasonPlaceholder: 'e.g. Work is finished, the area is restored and cold'
      },
      cancel: 'Cancel',
      confirm: 'Send Request',
      submitting: 'Sending…'
    },
    pendingEditWarning: {
      // wayfinder 012 — the contractor half. The warning fires BEFORE the resume route is opened,
      // because the wizard's own debounced save handler is what withdraws the permit server-side
      // the moment the contractor edits a field (wayfinder 022 — opening the route itself is now
      // read-only) — never after that save handler runs.
      title: 'Edit this pending permit?',
      body: 'This permit is awaiting Safety Officer review. Editing it now withdraws it from review and returns it to Draft. You will need to submit it again once you finish editing.',
      confirm: 'Continue Editing',
      cancel: 'Cancel'
    },
    markComplete: {
      // Design lines 549-559. The design's dialog also promises a GPS-tagged photo check after the
      // countdown; no endpoint models it, so it is not built and this copy does not claim it.
      title: 'Start Fire Watch?',
      body: 'This starts a mandatory {minutes}-minute Fire Watch countdown. The Fire Watcher must stay on-site for the whole period.',
      serverSide: 'The countdown runs server-side. It cannot be bypassed, paused or reset from any client, and closing a reloaded page does not restart it.',
      confirm: 'Start {minutes}-min Fire Watch',
      submitting: 'Starting…',
      cancel: 'Cancel'
    },
    fireMonitor: {
      heading: 'FIRE MONITORING ACTIVE',
      remaining: 'remaining',
      warning: 'Fire Watcher must remain on-site. Timer is server-side and cannot be bypassed or reset from any client.',
      // wayfinder 098 — this used to be a locked "Close Permit" button until the countdown ended,
      // because it used to close the permit directly. It now opens the request-closure modal,
      // which the api accepts at any point in FIRE_MONITOR — see FireMonitorPanel.vue's comment.
      close: 'Request Closure ✓',
      requestWhileRunning: 'You can request closure now — Safety cannot close the permit until the {remaining} Fire Watch countdown ends.'
    },
    qr: {
      title: 'Approved permit QR',
      alt: 'Permit QR code',
      hint: 'Scan at worksite to verify',
      live: 'Linked to live permit status',
      pending: {
        title: 'QR pending approval',
        description: 'Your QR code is generated automatically once the Safety Officer approves this permit.'
      }
    },
    // wayfinder 112 — the permit report tab. Full content, notes included, per map ruling 18.
    report: {
      printHint: 'Downloadable — use your browser\'s print dialog and choose "Save as PDF".',
      printButton: 'Print / Save as PDF',
      gapsTitle: 'Gaps',
      gaps: {
        none: 'No gaps found — every day has a visit and every reading was retested on time.',
        noVisitTitle: 'Day(s) with no inspector visit ({count})',
        overdueTitle: 'Overdue gas reading(s) — nobody took a retest in time ({count})',
        overdueRow: 'A retest was due by {dueAt} and none was recorded before the next reading (or before now).'
      },
      currentlyInside: 'Currently inside (live count): {count}',
      visitsTitle: 'Inspector visits',
      loading: 'Loading the report…',
      visitsEmpty: 'No inspector visits have been recorded for this permit yet.',
      visit: {
        started: 'Started {when}',
        submitted: 'submitted {when}',
        notSubmitted: 'not yet submitted',
        entrantsTitle: 'Entrant activity during this visit',
        ppeTitle: 'PPE',
        gasTitle: 'Gas readings during this visit',
        notesTitle: 'Notes',
        photosTitle: 'Photos'
      },
      source: {
        scan: 'Scan',
        manual: 'Manual',
        system: 'System'
      },
      entrant: {
        IN: '{who} checked in — {when}',
        OUT: '{who} checked out — {when}'
      },
      ppe: {
        none: 'No PPE was recorded on this visit.',
        gapsTitle: 'Undeclared gap flagged:',
        legacy: 'Recorded on an earlier checklist — shown as originally written, not mapped onto this app\'s PPE list.'
      },
      // Matches src/enums/modules/inspector-visit/InspectorVisitNoteType.enum.ts exactly.
      noteType: {
        GENERAL: 'General',
        WARNING: 'Warning',
        CORRECTIVE_ACTION: 'Corrective action',
        EMERGENCY: 'Emergency',
        INCIDENT: 'Incident'
      },
      closure: {
        title: 'Closure report',
        type: 'Type',
        window: 'Work window',
        location: 'Location',
        reasonTitle: 'Reason for closure',
        noReason: 'No reason was recorded.',
        entrantsTitle: 'Final entrant state',
        entrantsClear: 'No workers were auto-checked-out at closure.',
        autoCheckedOutRow: '{who} was auto-checked-out at closure — {when}',
        // Judgement call, documented in the implementation report: sourced from the permit's own
        // declared PPE rather than the most recent inspector visit's checklist.
        ppeTitle: 'Final PPE state (as declared on the permit)'
      }
    },
    // 2026-09-12 owner-filed issue 2 — the full-permit print/export (PermitPrintLayout.vue).
    // Distinct from `report` above, which is the Report tab's own partial print (visits/gaps/
    // closure only). Header/footer copy is shared with the Safety app's identical spec.
    print: {
      button: 'Print / Export PDF',
      header: {
        subtitle: 'Work Permit Management System'
      },
      footer: {
        printedVia: 'Printed via e-safework — {when}'
      },
      preWork: {
        title: 'Pre-work safety checklist',
        empty: 'No pre-work checklist was recorded for this permit.'
      },
      entrants: {
        title: 'Entrant register (IN / OUT log)',
        empty: 'No entrant activity has been recorded for this permit.',
        columnWorker: 'Worker',
        columnDirection: 'Direction',
        columnWhen: 'When',
        directionIn: 'IN',
        directionOut: 'OUT'
      },
      gasLog: {
        title: 'Gas log entries',
        empty: 'No gas log entries have been recorded for this permit.',
        columnWhen: 'Recorded',
        columnTester: 'Tester'
      },
      visits: {
        title: 'Inspector visit history',
        empty: 'No inspector visits have been recorded for this permit.'
      },
      approval: {
        title: 'Approval / rejection / closure'
      }
    }
  },
  toast: {
    // wayfinder ticket 008. These fire in ADDITION to any on-screen banner — the ruling names
    // "submitted"/"closed" explicitly, and the banner only confirms once the user has already
    // landed on the next page, not at the moment the action actually happened.
    submitted: 'Permit submitted for review',
    closed: 'Permit closed',
    // wayfinder 098 — replaces the retired "closed" toast for the contractor's own action; the
    // permit itself is unchanged, so no status-chip update accompanies this one.
    closeRequested: 'Closure requested — the Safety Officer has been notified',
    duplicated: 'Permit duplicated — continue editing the new draft'
  }
}

export default permit
