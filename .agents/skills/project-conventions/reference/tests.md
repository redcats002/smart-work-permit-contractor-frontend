---
title: Tests
type: convention
tags: [tests, vitest, testing]
---

# Tests

All tests in `src/tests/`. Use Vitest. Test utils in test-utils.ts.

```ts
import { describe, expect, it } from 'vitest'
import { factory } from './test-utils'
import App from '@/App.vue'

describe('App.vue', () => {
  it('Should mount', () => {
    const wrapper = factory(App)
    expect(wrapper.text).toBeTruthy()
  })
})
```
