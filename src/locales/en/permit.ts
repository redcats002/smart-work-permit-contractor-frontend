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
    blockedNote: 'Complete the required fields on this step to continue'
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
          foreman: 'Foreman',
          workDate: 'Date',
          workTimeStart: 'Start Time',
          workTimeEnd: 'End Time',
          location: 'Location'
        },
        map: {
          title: 'Location on map',
          placeholderNote: 'Placeholder facility plan — no real floor-plan asset ships yet',
          empty: 'Pick a zone or type a location to drop the pin',
          matchedZone: 'Matches the zone the safety officer sees on the risk map',
          customLocation: 'Location outside the zone list — the pin uses a stable position derived from the text',
          zone: {
            zone1: 'Zone 1',
            zone2: 'Zone 2',
            zone3: 'Zone 3',
            building2: 'Building 2',
            tankFarm: 'Tank Farm',
            processArea: 'Process Area',
            adminBuilding: 'Admin Building',
            utilityYard: 'Utility Yard'
          }
        },
        validation: {
          endAfterStart: 'End time must be after start time'
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
        checklistNotStored: 'A pre-work aid only — the permit API has no field for these answers, so they are not saved with the draft.',
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
          workers: 'Workers',
          jsaSteps: 'JSA Steps'
        },
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
      action: {
        PERMIT_SUBMITTED: 'Permit submitted',
        PERMIT_APPROVED: 'Permit approved',
        PERMIT_REJECTED: 'Permit rejected',
        PERMIT_MARKED_COMPLETE: 'Work marked complete — Fire Watch started',
        PERMIT_CLOSED: 'Permit closed',
        CERT_BLOCKED: 'Entry blocked — certificate invalid'
      }
    },
    closure: {
      // Design lines 574-611.
      start: 'Mark Work Complete →',
      title: 'Closure Checklist',
      subtitle: 'Confirm all items before closing. Foreman e-signature required (FM-SF-04 §D).',
      answerYes: 'Yes',
      answerNo: 'No',
      cancel: 'Cancel',
      confirm: 'Confirm & Close Permit',
      submitting: 'Closing…',
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
      },
      signature: {
        title: 'Engineer / Foreman e-Signature',
        tap: 'Tap to sign as Foreman',
        signed: 'Signed — {who}',
        pending: 'Not signed yet'
      },
      blocked: {
        entrants: 'Closure blocked — {count} entrant(s) still inside',
        // The backend reports the entrant count and names only inside its English `message`, which
        // is never rendered. No contractor-readable endpoint exposes them — docs/api/GAPS.md row I.
        entrantsDetail: 'The backend returns 403 until every entrant checks out via the Inspector app.',
        fireWatch: 'Closure blocked — Fire Watch still running',
        fireWatchDetail: 'The 30-minute Fire Watch is server-side. {remaining} remaining.',
        generic: 'Closure was refused'
      }
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
      locked: 'Close Permit — locked until {remaining}',
      close: 'Close Permit ✓'
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
    }
  },
  toast: {
    // wayfinder ticket 008. These fire in ADDITION to any on-screen banner — the ruling names
    // "submitted"/"closed" explicitly, and the banner only confirms once the user has already
    // landed on the next page, not at the moment the action actually happened.
    submitted: 'Permit submitted for review',
    closed: 'Permit closed',
    duplicated: 'Permit duplicated — continue editing the new draft'
  }
}

export default permit
