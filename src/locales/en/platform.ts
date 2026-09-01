const platform = {
  appName: 'e-safework',
  appTagline: 'ELECTRONIC SAFE WORK PERMIT · v3.0',
  accountType: 'Contractor account',
  sidebarSection: 'CONTRACTOR',
  nav: {
    permits: 'My Permits',
    newPermit: 'New Permit',
    history: 'History',
    certificates: 'Certificates'
  },
  localeSwitcher: {
    en: 'EN',
    th: 'ไทย'
  },
  menu: 'Menu',
  logout: 'Log out',
  notifications: {
    title: 'Notifications',
    empty: 'No notifications yet',
    dismiss: 'Dismiss'
  },
  auth: {
    title: 'Log in',
    subtitle: 'Enter your email and password to log in.',
    email: 'Email',
    password: 'Password',
    submit: 'Log in',
    loginSuccess: 'Welcome back',
    trial: {
      label: 'Trial account',
      contractor: 'Contractor',
      unavailable: 'Trial login is not available in this environment.'
    },
    // wayfinder ticket 032. Distinct from `trial` above: that button signs in through the
    // server-issued demo-login route (023) and never touches a password. This one fills the
    // FORM with a real test account so a UAT tester sees exactly what they are signing in as —
    // it never submits by itself.
    trialFill: {
      label: 'UAT — fill sign-in form',
      contractor: 'Fill Contractor',
      hint: 'Fills the form with a test contractor account. Review the fields, then press Sign In.'
    },
    validation: {
      emailRequired: 'Please enter your email',
      emailInvalid: 'Invalid email format',
      passwordRequired: 'Please enter your password'
    },
    resetPassword: {
      title: 'Set a new password',
      subtitle: 'Enter your new password',
      newPassword: 'New password',
      confirmNewPassword: 'Confirm new password',
      submit: 'Confirm',
      success: 'Password reset successful',
      tokenInvalidTitle: 'Link expired',
      tokenInvalidDescription: 'Please request a new password reset link',
      tokenInvalidToast: 'Link expired or invalid',
      validation: {
        passwordLength: 'Must be 8-16 characters combining English letters and numbers',
        passwordUpper: 'Must contain at least one uppercase English letter',
        passwordNumber: 'Must contain at least one digit (0-9)',
        confirmRequired: 'Please confirm your password',
        confirmMismatch: 'Passwords do not match'
      }
    }
  }
}

export default platform
