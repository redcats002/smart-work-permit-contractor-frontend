# Integrate the reset password flow

## Implement UI page and integrate with api

Workflow:
1. In @src/pages/employee/pages/detail/pages/EmployeeDetailPage.vue after call onResetPassword it will request to api endpoint `POST /api/v1/auth/public/user-request-password-reset`
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
2. then user will receive link that redirect to reset-password route `http://localhost:8080/auth/reset-password?token=hV0omujYSape6F7jwxr9Rgmj` with token query
3. you have to create new route/page following to link and call check token 
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
- if token valid just let user pass
- else toast.error and redirect to EmployeeDetailPage with that user id
4. if token valid it user will have form to reset password using @src/pages/auth/pages/login/components/auth/form/SetPasswordForm.vue
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
5. then if authStore user is same as user that just reset password -> force logout and router to login page
else keep the session and router.push to EmployeeDetailPage with that user id params

