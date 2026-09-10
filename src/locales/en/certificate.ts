const certificate = {
  title: 'Certificates & Personnel',
  status: {
    VALID: '✓ Valid',
    EXPIRING_SOON: '⚠ Expires soon',
    EXPIRED: '✕ Expired'
  },
  list: {
    title: 'Certificates & Personnel',
    subtitle: 'Expired or missing certs block permit submission. Linked to wizard validation.',
    addButton: '＋ Add Certificate',
    searchPlaceholder: 'Search by worker name',
    // wayfinder 110 — the server has no validity-status filter on this endpoint (see
    // list.service.ts in the api), so the filter this list gained is by worker, not by status.
    filterByWorker: {
      placeholder: 'All workers'
    },
    empty: {
      title: 'No certificates yet',
      description: 'Certificates you add for your workers will show up here.'
    },
    error: {
      loadFailed: 'Could not load certificates. Please try again.'
    }
  },
  card: {
    certType: 'Certificate type',
    issued: 'Issued',
    expiry: 'Expires',
    noFile: 'No file attached',
    hasFile: 'Attachment',
    viewHint: 'View details'
  },
  // wayfinder 086 — the closed set the certType Select offers, keyed the same way
  // permit.create.steps.ppeWorkers.role slugs its own vocabulary. Mirrors the API's
  // worker-vocabulary.const.ts ECertType; this frontend does not yet fetch it (050's known
  // interim state).
  type: {
    'hot-work': 'Hot Work',
    'confined-space-entry': 'Confined Space Entry',
    'working-at-heights': 'Working at Heights',
    'gas-testing': 'Gas Testing'
  },
  detail: {
    title: 'Certificate',
    editButton: 'Edit certificate',
    backToList: 'Back to certificates',
    attachment: 'Attachment',
    openFile: 'Open attachment',
    openingFile: 'Opening…',
    registered: 'Registered',
    lastUpdated: 'Last updated',
    error: {
      loadFailed: 'Could not load this certificate. Please try again.',
      fileFailed: 'Could not open the attachment. Please try again.'
    }
  },
  edit: {
    title: 'Edit Certificate',
    submit: 'Save changes',
    cancel: 'Cancel',
    saved: 'Certificate updated.',
    currentFile: 'Current attachment',
    replaceFile: 'Replace attachment',
    keepFileHint: 'Leave empty to keep the current attachment.',
    removeFile: 'Remove attachment',
    removeFileHint: 'The certificate will be saved without an attachment.',
    undoRemoveFile: 'Keep it after all'
  },
  form: {
    title: 'Add Certificate',
    field: {
      workerName: 'Worker name',
      role: 'Role',
      certType: 'Certificate type',
      certTypePlaceholder: 'Select a certificate type',
      certTypeUnknownRoleNote: 'Showing every certificate type — this worker\'s role isn\'t in our list.',
      certTypeLegacyLabel: '{value} (not in the standard list)',
      issuedDate: 'Issued date',
      expiryDate: 'Expiry date',
      file: 'Attachment',
      filePlaceholder: 'Attach file (optional)'
    },
    submit: 'Save Certificate',
    validation: {
      workerNameRequired: 'Please enter the worker name',
      roleRequired: 'Please enter the role',
      certTypeRequired: 'Please select a certificate type',
      fileType: 'File must be a JPEG, PNG, WEBP or HEIC image, or a PDF',
      expiryAfterIssued: 'Expiry date must be after the issued date'
    }
  }
}

export default certificate
