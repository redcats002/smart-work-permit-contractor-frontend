# Agent execution instruction
> Use both `/grill-with-docs` and `/tdd` for this task.
> - `/grill-with-docs`: inspect all referenced files, existing patterns, related dashboard flows, shared UI components, provider structure, and typing conventions before implementation
> - `/tdd`: implement with a test-driven workflow where practical and verify the final behavior before finishing

# Implement new UI of Dashboard page according to Figma design

## Important instructions
- Follow project conventions strictly
- Refactor after implementation is complete
- Standardize code according to `AGENTS.md`
- Do not hallucinate
- If any behavior, data shape, or design detail is unclear, ask before implementing
- Prefer proper placement of types, interfaces, mock data, and providers based on existing project structure

---

## Objective
Update the Dashboard page UI according to the provided Figma design.

This task includes:
- updating the dashboard UI
- using mock data for the implementation
- creating files for types, interfaces, and provider in the proper locations
- refactoring after implementation
- standardizing the final code according to project conventions in `AGENTS.md`

---

## Figma
- https://www.figma.com/design/bjk95TsEY9we45tVR03OyB/Mittae-Siam?node-id=2507-215&m=dev

---

## Context
Target page:
- `@src/pages/dashboard/pages/list/pages/DashboardListPage.vue`

---

## Requirements

### 1) Update dashboard UI
Implement the new dashboard UI in:

- `@src/pages/dashboard/pages/list/pages/DashboardListPage.vue`

The page should match the Figma design as closely as possible.

### 2) Use mock data
Use mock data for the dashboard content during this implementation.

### 3) Create files properly
Create and place related files properly according to project conventions, such as:
- types
- interfaces
- provider
- mock data source files

Do not keep temporary inline mock structures in the page if they should live in separate files.

### 4) Refactor after implementation
After the UI is working:
- refactor for maintainability
- standardize naming and structure
- align implementation with project conventions in `AGENTS.md`

---

## Implementation notes
- Inspect current dashboard page structure before changing it
- Reuse existing shared components if appropriate
- Prefer extracted section-based components if the page becomes large
- Keep mock provider and related types organized in the appropriate domain/module structure
- Avoid leaving large inline interfaces, types, or mock objects inside the page component unless that is already the project standard

---

## Expected outcome
- Dashboard page UI is updated to match Figma
- Mock data is used cleanly
- Types/interfaces/provider files are created in proper locations
- Code is refactored and standardized according to `AGENTS.md`
- Final implementation is maintainable and aligned with project conventions

---

## Suggested implementation steps
1. Inspect `DashboardListPage.vue`
2. Inspect similar dashboard/list pages and shared components in the project
3. Review project conventions in `AGENTS.md`
4. Implement the new UI according to Figma
5. Create mock data source/provider in the proper location
6. Create related types/interfaces in the proper location
7. Refactor the page into smaller components if needed
8. Standardize naming, structure, and file placement
9. Verify the final result against Figma and project conventions

---

## TODO checklist
- [ ] Inspect `DashboardListPage.vue`
- [ ] Inspect related shared components and patterns
- [ ] Review `AGENTS.md`
- [ ] Implement new dashboard UI according to Figma
- [ ] Add mock data for dashboard content
- [ ] Create provider file in the proper location
- [ ] Create type/interface files in the proper location
- [ ] Remove unnecessary inline mock/type definitions from the page
- [ ] Refactor for maintainability
- [ ] Standardize code according to project conventions
- [ ] Verify final UI against Figma