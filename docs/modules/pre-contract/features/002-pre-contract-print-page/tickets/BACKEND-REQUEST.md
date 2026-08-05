# Backend request — PRE-002 (pre-contract print)

Frontend is built and merged against the widened shape below. Both fields are **optional** on
the FE interface, so nothing breaks while this is pending — the printed document simply leaves
`อายุ` and the borrower address blank until the API returns them.

---

## Endpoint

```
GET /api/v1/management/pre-contract/:id
```

## Needs added to `data.borrowers[].customer`

Currently returns:

```json
"borrowers": [
  {
    "isMain": true,
    "customer": {
      "id": 18,
      "idNo": "CUS-000018",
      "idCard": "1102700822339",
      "email": "kan@makewebbkk.com",
      "titleName": "MR",
      "firstName": "นนทกร",
      "lastName": "ลูกค้าของจริง",
      "fullName": "นนทกร ลูกค้าของจริง"
    }
  }
]
```

Please add:

1. **`birthDate`** — ISO 8601 string, e.g. `"2002-05-05T17:00:00.000Z"`.
   Used to compute `อายุ` (age in years) on the printed agreement.

2. **`mainAddress`** — object, same shape already returned on `data.customer.mainAddress`:

   ```json
   "mainAddress": {
     "address": "12/232",
     "villageNo": "5",
     "subDistrict": "สายไหม",
     "district": "สายไหม",
     "province": "กรุงเทพมหานคร",
     "postCode": "10220"
   }
   ```

   The printed document reads `address`, `villageNo`, `subDistrict`, `district`, `province`.
   **`villageNo` (หมู่) is missing from the current `data.customer.mainAddress` payload too** —
   please include it wherever `mainAddress` is returned; it prints as `-` when absent.

## Target shape

```json
"customer": {
  "id": 18,
  "idNo": "CUS-000018",
  "idCard": "1102700822339",
  "email": "kan@makewebbkk.com",
  "titleName": "MR",
  "firstName": "นนทกร",
  "lastName": "ลูกค้าของจริง",
  "fullName": "นนทกร ลูกค้าของจริง",
  "birthDate": "2002-05-05T17:00:00.000Z",
  "mainAddress": {
    "address": "12/232",
    "villageNo": "5",
    "subDistrict": "สายไหม",
    "district": "สายไหม",
    "province": "กรุงเทพมหานคร",
    "postCode": "10220"
  }
}
```

## Why not use the top-level `customer`

`data.customer` already carries both fields, but it only describes the **primary** customer.
A pre-contract can have co-borrowers. Using it would print the primary customer's address
against a co-borrower's name on a legal loan agreement, so the fields are needed per borrower.

## Precedent

The contract API already returns this shape — `IContractCustomer` on
`GET /api/v1/management/contract/:id` has `idCard`, `birthDate` and `mainAddress` on each
borrower. This request just brings pre-contract to parity.

---

## Not requested (deliberately)

`firstInstallmentDate` / `finalInstallmentDate` are **not** being asked for. A pre-contract has
no agreed schedule; those fields print as blank underlines to be completed by hand. Do not add
them without a product decision.
