# Agent execution instruction
> Use both `/grill-with-docs` and `/tdd` for this task.
> - `/grill-with-docs`: inspect all referenced files, auth flow patterns, routing conventions, provider patterns, toast usage, auth store behavior, and existing password form implementation before coding
> - `/tdd`: implement and verify the reset password flow with a test-driven workflow where practical before finishing

# Integrate the reset password flow
## Implement UI page and integrate with API

## Important instructions
- Follow project conventions strictly
- Reuse existing auth page, form, store, provider, routing, and toast patterns where possible
- Do not hallucinate
- If route naming, user ID source, or auth store behavior is unclear, ask before implementing
- Keep types/enums extracted instead of inline types when appropriate
- Refactor after integration if needed to keep the flow maintainable and aligned with project conventions

---

## Goal
Implement the full **reset password flow**:
1. trigger password reset request from Employee Detail page
2. handle redirect to reset-password route with token
3. validate the token
4. show reset password form if valid
5. submit new password
6. redirect / logout according to whether the current session belongs to the same user

---

## Workflow

### 1) Trigger reset password request from Employee Detail page
In:

- `@src/pages/employee/pages/detail/pages/EmployeeDetailPage.vue`

after calling `onResetPassword`, request:

- `POST /api/v1/auth/public/user-request-password-reset`

### API usage
```ts
import axios from 'axios'

const options = {
  method: 'POST',
  url: '/api/v1/auth/public/user-request-password-reset',
  headers: {
    'Content-Type': 'application/json'
  },
  data: {
    email: ''
  }
}

try {
  const { data } = await axios.request(options)
  console.log(data)
} catch (error) {
  console.error(error)
}
```

### Requirement
- Use the employee/user email as payload
- Follow existing provider and action handling conventions
- Keep UI feedback aligned with current app behavior (success/error handling, toast, loading state, etc.)

---

### 2) User opens reset-password link
The user will receive a link like:

- `http://localhost:8080/auth/reset-password?token=hV0omujYSape6F7jwxr9Rgmj`

### Requirement
Create a new route/page to support this flow.

The route should:
- read `token` from query params
- follow project auth route conventions
- be implemented in the proper auth page/module structure

---

### 3) Check token validity
When the reset-password page opens, call:

- `POST /api/v1/auth/public/check-token-reset-password`

### API usage
```ts
import axios from 'axios'

const options = {
  method: 'POST',
  url: '/api/v1/auth/public/check-token-reset-password',
  headers: {
    'Content-Type': 'application/json'
  },
  data: {
    token: ''
  }
}

try {
  const { data } = await axios.request(options)
  console.log(data)
} catch (error) {
  console.error(error)
}
```

### Requirement
- If token is valid:
  - allow user to proceed
- If token is invalid:
  - `toast.error(...)`
  - redirect to `EmployeeDetailPage` with that user ID

### Important note
The redirect requires the employee/user ID.  
If the user ID source is not already available from the token flow or current context, inspect the current flow and ask if needed rather than guessing.

---

### 4) Show reset password form and submit new password
If token is valid, show the reset password form using:

- `@src/pages/auth/pages/login/components/auth/form/SetPasswordForm.vue`

Use it to submit:

- `POST /api/v1/auth/public/user-reset-password`

### API usage
```ts
import axios from 'axios'

const options = {
  method: 'POST',
  url: '/api/v1/auth/public/user-reset-password',
  headers: {
    'Content-Type': 'application/json'
  },
  data: {
    newPassword: '',
    token: ''
  }
}

try {
  const { data } = await axios.request(options)
  console.log(data)
} catch (error) {
  console.error(error)
}
```

### Requirement
- Reuse `SetPasswordForm.vue`
- Keep submission flow aligned with existing auth form patterns
- Pass the token together with the new password
- Show appropriate loading/success/error feedback

---

### 5) Redirect or force logout after password reset
After successful password reset:

#### Case A — current logged-in user is the same user whose password was reset
- force logout
- route to login page

#### Case B — current logged-in user is not the same user
- keep the current session
- `router.push(...)` to `EmployeeDetailPage` with that user ID param

### Requirement
- Use existing auth store/session handling patterns
- Do not invent a logout flow if one already exists in the project
- If user identity comparison requires a field not clearly available from the reset flow, inspect current auth/user data shape and ask if needed

---

## Target files
At minimum, inspect and update/create as needed:

- `@src/pages/employee/pages/detail/pages/EmployeeDetailPage.vue`
- `@src/pages/auth/pages/login/components/auth/form/SetPasswordForm.vue`

And create/update:
- auth reset-password route
- auth reset-password page
- relevant provider/auth API integration
- any related composable/store logic needed for token validation and submission flow

---

## Implementation notes
- Reuse existing auth flow patterns wherever possible
- Prefer provider/service methods instead of direct inline axios usage in components if that is the project convention
- Keep route/page naming aligned with current auth page structure
- Keep token validation separate from password submission logic if that improves maintainability
- Use extracted types/interfaces instead of inline anonymous objects where appropriate
- Refactor after implementation if the flow becomes too coupled

---

## Suggested structure
A maintainable approach may include:
- provider methods for:
  - request password reset
  - check reset token
  - reset password
- new reset password page
- route definition
- composable or local page logic to:
  - read token
  - validate token
  - handle invalid-token redirect
  - submit new password
- integration in Employee Detail page action

Follow actual project conventions first.

---

## Expected outcome
- Employee Detail page can trigger password reset request
- User can open `/auth/reset-password?token=...`
- Reset page validates token before allowing reset
- Invalid token shows toast error and redirects correctly
- Valid token shows `SetPasswordForm.vue`
- New password can be submitted successfully
- If the reset target user is the same as the current logged-in user, session is forced to logout and user is sent to login page
- Otherwise, current session stays active and redirects back to Employee Detail page

---

## Suggested implementation steps
1. Inspect `EmployeeDetailPage.vue`
2. Inspect how `onResetPassword` currently works
3. Inspect auth provider/store structure
4. Add/update provider methods for:
   - request password reset
   - check token reset password
   - user reset password
5. Create new reset-password route/page
6. Read token from query param
7. Validate token on page load
8. Handle invalid token redirect + toast
9. Reuse `SetPasswordForm.vue` for new password form
10. Submit reset password API
11. Compare reset target user with current `authStore` user
12. Apply logout or redirect behavior accordingly
13. Refactor and standardize according to project conventions

---

## TODO checklist
- [ ] Inspect `EmployeeDetailPage.vue`
- [ ] Inspect current `onResetPassword` flow
- [ ] Inspect auth provider/service structure
- [ ] Add/update provider method for `POST /api/v1/auth/public/user-request-password-reset`
- [ ] Add/update provider method for `POST /api/v1/auth/public/check-token-reset-password`
- [ ] Add/update provider method for `POST /api/v1/auth/public/user-reset-password`
- [ ] Create reset-password route
- [ ] Create reset-password page
- [ ] Read `token` from query params
- [ ] Validate reset token on page load
- [ ] Handle invalid token case with `toast.error`
- [ ] Redirect invalid token case to `EmployeeDetailPage` with user ID
- [ ] Reuse `SetPasswordForm.vue`
- [ ] Submit `newPassword` + `token`
- [ ] Handle success flow after password reset
- [ ] Compare reset target user with current `authStore` user
- [ ] Force logout and redirect to login if same user
- [ ] Keep session and redirect to Employee Detail page if different user
- [ ] Refactor and standardize according to project conventions