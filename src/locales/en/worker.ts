const worker = {
  picker: {
    label: 'Worker',
    placeholder: 'Search a worker by name',
    noMatch: 'No worker matches. You can add them below.',
    addNew: 'Add "{name}" as a new worker',
    createHint: 'Registering "{name}" as a new worker. What is their role?',
    rolePlaceholder: 'Role (e.g. Welder)',
    createButton: 'Add worker',
    creating: 'Adding…'
  },
  validation: {
    required: 'Please choose a worker, or add a new one'
  },
  list: {
    title: 'Workers',
    subtitle: 'Everyone you have registered — their certificates, and which permits they are on.',
    addButton: 'Register worker',
    searchPlaceholder: 'Search by name',
    column: {
      name: 'Name',
      role: 'Role',
      certificate: 'Certificate',
      permits: 'Permits'
    },
    certificate: {
      none: 'No certificate'
    },
    empty: {
      title: 'No workers yet',
      description: 'Register your first worker to start attaching certificates and adding them to permits.'
    },
    error: {
      loadFailed: 'Could not load the worker list.'
    }
  },
  detail: {
    backToList: 'Back to workers',
    title: 'Worker',
    editButton: 'Edit',
    saveButton: 'Save',
    retireButton: 'Retire worker',
    retiredBadge: 'Retired',
    sectionIdentity: 'Identity',
    fieldName: 'Name',
    fieldRole: 'Role',
    fieldIdCardNo: 'ID card number',
    fieldPhone: 'Phone',
    savedToast: 'Worker details saved',
    error: {
      loadFailed: 'Could not load this worker.',
      saveFailed: 'Could not save these changes.'
    },
    sectionCertificates: 'Certificates',
    addCertificate: 'Add certificate',
    certificatesEmpty: 'No certificates on file for this worker yet.',
    sectionPermits: 'Permits',
    permitsEmpty: 'This worker does not appear on any permit yet.',
    qr: {
      title: 'Worker QR',
      hint: 'Scan to look up this worker on site',
      alt: 'QR code encoding this worker\'s id'
    },
    retire: {
      title: 'Retire this worker?',
      description: 'They will disappear from suggestions and the worker list, and stay readable on every certificate and permit that already references them.',
      confirm: 'Yes, retire'
    },
    retiredToast: 'Worker retired'
  },
  form: {
    createTitle: 'Register a worker',
    fieldName: 'Name',
    fieldRole: 'Role',
    fieldIdCardNo: 'ID card number',
    fieldPhone: 'Phone',
    submit: 'Register',
    validation: {
      nameRequired: 'Please enter a name',
      roleRequired: 'Please choose a role'
    }
  }
}

export default worker
