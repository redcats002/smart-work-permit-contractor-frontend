const common = {
  back: 'Back',
  next: 'Next',
  clear: 'Clear',
  close: 'Close',
  view: 'View',
  cancel: 'Cancel',
  confirm: 'Confirm',
  save: 'Save',
  submit: 'Submit',
  yes: 'Yes',
  no: 'No',
  notApplicable: 'N/A',
  // wayfinder ticket 028 — the show/hide toggle Volt's Password ships with is icon-only and
  // click-only (PrimeVue's own default, not something this repo broke); PasswordInput.vue adds
  // the label + keyboard handling around it without editing src/volt/Password.vue.
  password: {
    show: 'Show password',
    hide: 'Hide password'
  },
  validation: {
    required: 'Please select {label}',
    requiredField: 'Please specify {label}',
    invalidImageUrl: 'Invalid image URL',
    invalidImagePath: 'Invalid image path',
    invalidImageName: 'Invalid image name',
    invalidFileType: 'File must be an image or PDF'
  }
}

export default common
