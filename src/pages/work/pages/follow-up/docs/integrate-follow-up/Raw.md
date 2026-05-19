# Agent execution instruction
> Use both `/grill-with-docs` and `/tdd` for this task.
> - `/grill-with-docs`: inspect all referenced files, existing flows, provider patterns, and related UI before implementation
> - `/tdd`: implement with a test-driven approach and verify behavior before finishing

# Integrate the followup page with following api
- Update the provider according to api and able to remove thing that unused
- Refactor code and keep standard code convention on agent.md
- Prefer to create enum/type instead of inline type (mark it and always keep this into agents.md)

API:
```ts
import axios from 'axios'

const options = {
  method: 'GET',
  url: '/api/v1/management/work/debt-collection',
  params: {
    page: '1',
    limit: '10',
    sortBy: 'createdAt',
    sortOrder: 'asc' | 'desc',
    search: 'LC-00001',
    status: 'PENDING' | 'COMPLETED'
  }
}

try {
  const { data } = await axios.request(options)
  console.log(data)
} catch (error) {
  console.error(error)
}
```
response
```jsonc
{
  "message": "success",
  "totalPage": 1,
  "page": 1,
  "limit": 1,
  "count": 1,
  "data": [
    {
      "contract": {
        "id": 1,
        "idNo": "string"
      },
      "order": 1,
      "customer": {
        "id": 1,
        "idNo": "string",
        "firstName": "string",
        "lastName": "string",
        "fullName": "string",
        "phoneNumber": "string"
      }
    }
  ]
}
```

Context:
- Composable to integrate with followup page @src/pages/work/pages/follow-up/composables/useList.ts 