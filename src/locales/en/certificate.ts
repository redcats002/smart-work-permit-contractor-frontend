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
      filePlaceholder: 'Attach file (optional)'
    },
    submit: 'Save Certificate',
    validation: {
      workerNameRequired: 'Please enter the worker name',
      roleRequired: 'Please enter the role',
      certTypeRequired: 'Please enter the certificate type',
      fileType: 'File must be an image or PDF',
      expiryAfterIssued: 'Expiry date must be after the issued date'
    }
  }
}

export default certificate
