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
      issuedDate: 'Issued date',
      expiryDate: 'Expiry date',
      file: 'Attachment',
      filePlaceholder: 'Attach file (optional)'
    },
    submit: 'Save Certificate',
    validation: {
      workerNameRequired: 'Please enter the worker name',
      roleRequired: 'Please enter the role',
      certTypeRequired: 'Please enter the certificate type',
      fileType: 'File must be a JPEG, PNG, WEBP or HEIC image, or a PDF',
      expiryAfterIssued: 'Expiry date must be after the issued date'
    }
  }
}

export default certificate
