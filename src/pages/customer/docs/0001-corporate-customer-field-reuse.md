# Corporate customers reuse Individual fields instead of adding dedicated ones

Adding `personalType` (INDIVIDUAL/CORPORATE) to Customer required deciding how Corporate-only concepts map onto the existing schema. Backend chose to reuse `idCard` as the tax ID and `firstName` as the registered company name for CORPORATE customers, rather than introducing `taxId`/`companyName` fields. `titleName`, `lastName`, `birthDate`, and `occupationId` are optional and omitted from the payload for CORPORATE. `currentAddress` and `workAddress` are likewise optional and omitted entirely (not mirrored from `mainAddress`) for CORPORATE — only `mainAddress` is sent.

This keeps the payload shape backward compatible (no new required columns), but means the frontend must dynamically relabel `idCard` → "เลขประจำตัวผู้เสียภาษี" and `firstName` → "ชื่อ" (company name) based on `personalType`, and the schema must conditionally require/omit fields rather than share one flat required shape.
