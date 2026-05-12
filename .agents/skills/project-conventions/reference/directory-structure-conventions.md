---
title: Directory Structure Conventions
type: convention
tags: [structure, directory, organization]
---

# Directory Structure Conventions

```
src/
├── assets/
│   └── css/                      # main.css, tailwind.css, primevue.css, fonts.css
├── components/
│   ├── app/                      # App-chrome: AppDrawer, AppDrawerMenu
│   ├── base/                     # Layout primitives: BasePage, BaseTop, BaseContainer, BaseTab, BaseTabWindow
│   ├── button/                   # Semantic action buttons by intent
│   ├── badge/                    # Chip/badge components
│   ├── card/                     # Card wrappers
│   ├── display/                  # Read-only display components
│   ├── flex/                     # Flex helpers (Spacer)
│   ├── form/                     # Form building blocks
│   ├── input/                    # Custom input components (LabelField, PhoneNumberInput, etc.)
│   ├── loader/                   # Skeleton/spinner states
│   ├── modal/                    # Dialog wrappers
│   ├── nav/                      # Navigation components
│   ├── progress/                 # Progress indicators
│   ├── table/                    # Table helpers
│   └── transition/               # Vue transition wrappers
├── composables/                  # useX composables (pagination, copy, tabs, init, detail, payload, etc.)
├── layouts/                      # DefaultLayout.vue, BlankLayout.vue
├── locales/                      # i18n translations (en.ts, th.ts) (if project installed vue-i18n)
├── models/
│   ├── Global.model.ts           # IEntity, IAuthor, IBaseOption, IBaseModel, IPagination, IFormState
│   ├── Table.model.ts            # ITableSort, ITableHeader, etc.
│   ├── Auth/                     # Auth-related models
│   ├── Request/                  # API request models (extends IBasePaginationRequest)
│   ├── Response/                 # API response models (IBaseSuccessResponse, IBasePaginationResponse, IErrorResponse)
│   └── modules/                  # Feature-specific or Domain-specific models (<DomainName or FeatureName>.model.ts, etc.)
├── pages/                        # Domain pages (nested per-domain folder)
├── plugins/                      # Vue plugin registrations
├── resources/                    # HTTP layer
│   ├── HttpRequest.ts            # Base HTTP class
│   ├── Interceptors.ts           # Axios interceptors (camelCase conversion, auth, etc.)
│   └── provider/                 # API provider classes (extend HttpRequest, export as default)
├── router/
│   ├── index.ts                  # Main router config
│   ├── navigation.ts             # Navigation helpers
│   └── modules/                  # Domain-specific routes (<DomainName>.route.ts)
├── stores/                       # Pinia stores (setup pattern)
├── tests/                        # Vitest test files
│   ├── components/               # Component unit tests 
│   ├── composables/              # Composable unit tests
│   └── utils/                    # Utility unit tests
├── utils/                        # Pure utilities (stateless, no side effects)
├── volt/                         # PrimeVue Volt component wrappers (auto-imported)
│   ├── Input*.vue                # InputText, InputNumber, InputMask, etc.
│   └── ...                       # Other Volt components
├── App.vue                       # Root component
└── main.ts                       # Application entry point
```

## Page Structure (Domain Folder)

Each Domain follows this nested structure:

```
src/pages/<Domain>/
├── <Domain>Page.vue               # route shell (usually just <router-view>)
├── pages/
│   └── <Feature>Page.vue          # ListPage, CreatePage, DetailPage + detail/<Tab>Page.vue
├── schema/                        # Domain-specific schema files for forms
├── composables/                   # Domain-specific composables
├── components/                    # Domain-specific components
├── tests/                         # Domain-specific tests (required for all new features)
│   ├── playwright/                # Playwright E2E tests for this domain
│   └── unit/                      # Unit tests for domain components/composables
└── models/                        # Domain-specific model extensions (if needed)
```

## Components

Organized by intent:
- `base/` — Layout primitives (BasePage, BaseContainer, BaseTab, etc.)
- `button/` — Semantic action buttons (CreateButton, EditButton, etc.)
- `form/` — Form helpers (FormTitle, PasswordProgressbar)
- `input/` — Custom input fields (LabelField, PhoneNumberInput, etc.)
- `badge/`, `card/`, `modal/`, `table/`, `transition/`, `navigation-drawer/`, `autocomplete-api/`, `selection/`

**Pattern:** All components use `<script setup lang="ts">`. No Options API. No `defineComponent`.
