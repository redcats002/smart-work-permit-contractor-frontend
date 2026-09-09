<template>
  <div class="relative mt-4">
    <SecondaryButton
      :aria-expanded="open"
      aria-haspopup="menu"
      class="min-h-11 w-full"
      data-test="demo-login-toggle"
      type="button"
      @click="open = !open">
      {{ t('platform.auth.demo.button') }}
    </SecondaryButton>

    <ul
      v-if="open"
      class="absolute bottom-full z-10 mb-1 w-full overflow-hidden rounded-lg border border-border-input bg-surface-card shadow-lg"
      role="menu">
      <li
        v-for="(account, index) in DEMO_ACCOUNTS"
        :key="account.labelKey">
        <button
          :data-test="`demo-login-${account.key}`"
          :disabled="busy"
          class="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-text-primary
            hover:bg-surface-app disabled:cursor-not-allowed disabled:opacity-60"
          role="menuitem"
          type="button"
          @click="onPick(account)">
          <span class="text-text-tertiary">{{ index + 1 }}.</span>
          {{ t(account.labelKey) }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import { DEMO_ACCOUNTS, type IDemoAccount } from '../../constants/DemoAccounts'

/**
 * One-click sign-in for demonstrations.
 *
 * ⚠ This ships REAL CREDENTIALS IN THE PRODUCTION BUNDLE. See DemoAccounts.ts for the full note;
 * the short version is that anyone who opens the deployed sign-in page can read these passwords
 * out of the JavaScript and sign in as those accounts. That is a deliberate owner decision
 * (2026-09-09), reversing the 2026-09-08 ruling recorded in wayfinder 042 — not an oversight, and
 * not something to "clean up" without asking the owner first.
 */
interface IProps {
  busy?: boolean
}

withDefaults(defineProps<IProps>(), { busy: false })

const emit = defineEmits<{ pick: [account: IDemoAccount] }>()

const { t } = useI18n()
const open = ref(false)

function onPick (account: IDemoAccount): void {
  open.value = false
  emit('pick', account)
}
</script>

<style scoped></style>
