# Integrate Dashboard according actual api 

Update the @src/resources/provider/dashboard/Dashboard.provider.ts and integrate into @src/pages/dashboard/pages/list/pages/DashboardListPage.vue and remove @src/resources/provider/dashboard/Dashboard.mock.ts out
1. dashboard card endpoint
```ts
import axios from 'axios'

const options = {
  method: 'GET',
  url: '/api/v1/dashboard/card',
  params: {
    branchId: ''
  }
}

try {
  const { data } = await axios.request(options)
  console.log(data)
} catch (error) {
  console.error(error)
}
```
response:
```jsonc
{
  "message": "success",
  "data": {
    "daily": 1,
    "cash": 1,
    "bankTransfer": 1,
    "totalOutstanding": 1,
    "outstandingPrincipal": 1,
    "outstandingInterest": 1
  }
}
```

2. chart market endpoint
```ts
import axios from 'axios'

const options = {
  method: 'GET',
  url: '/api/v1/dashboard/chart-market',
  params: {
    branchId: '',
    startDate: '',
    endDate: ''
  }
}

try {
  const { data } = await axios.request(options)
  console.log(data)
} catch (error) {
  console.error(error)
}
```
response:
```jsonc
{
  "message": "success",
  "data": {
    "total": 1,
    "items": [
      {
        "id": 1,
        "name": "string",
        "total": 1,
        "percent": 1
      }
    ]
  }
}
```

3. chart-loan
```ts
import axios from 'axios'

const options = {
  method: 'GET',
  url: '/api/v1/dashboard/chart-loan',
  params: {
    branchId: '',
    startDate: '',
    endDate: ''
  }
}

try {
  const { data } = await axios.request(options)
  console.log(data)
} catch (error) {
  console.error(error)
}
```
response:
```jsonc
{
  "message": "success",
  "data": {
    "total": 1,
    "items": [
      {
        "id": 1,
        "name": "string",
        "total": 1,
        "percent": 1
      }
    ]
  }
}
```