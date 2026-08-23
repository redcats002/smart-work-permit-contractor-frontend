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
    noFile: 'No file attached'
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
      filePlaceholder: 'Attach file (optional)',
      fileNotStoredHint: 'Attachments are not stored by the server yet — the certificate record saves without the file.'
    },
    submit: 'Save Certificate',
    attachmentNotStored: 'Certificate saved, but the attached file was not stored — the server does not accept attachments yet.',
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
