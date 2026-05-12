---
title: Utility Functions
type: convention
tags: [utils, formatter, keypress, thai]
---

# Utility Functions

## Number/String Formatting (`src/utils/Formatter.ts`)

```typescript
formatter.number(1234567)          // '1,234,567'
formatter.numberTwoDecimal(1234.5) // '1,234.50'
formatter.baht(1234567)            // '1,234,567.00 บาท'
formatter.thaiCitizenId('1234567890123') // '1-2345-67890-12-3'
formatter.phone('0812345678')      // '081-234-5678'
formatter.fullName(titleName, firstName, lastName) // 'นาย John Doe'
```

## Input Guards (`src/utils/Keypress.ts`)

```typescript
// Use on @keypress event to restrict input
@keypress="number"           // numbers + decimal
@keypress="numberNoDecimal"  // integers only
@keypress="telInput"         // phone number characters
@keypress="emailNoThai"      // no Thai characters in email
```
