<template>
  <div>
    <div class="flex flex-col gap-4 border-b border-border px-4 py-5 sm:flex-row sm:items-end sm:justify-between md:px-8 md:py-6">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
          {{ t('profile.title') }}
        </h1>
        <p class="mt-0.5 text-sm text-text-secondary">
          {{ t('profile.subtitle') }}
        </p>
      </div>
    </div>

    <div class="px-4 py-6 md:px-8">
      <div
        v-if="loading"
        class="flex flex-col gap-3">
        <Skeleton
          v-for="n in 4"
          :key="n"
          class="rounded-xl!"
          height="3rem" />
      </div>

      <form
        v-else
        class="flex max-w-3xl flex-col gap-6"
        @submit.prevent="save()">
        <p
          v-if="errorMessage"
          class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {{ errorMessage }}
        </p>

        <section class="flex flex-col gap-3 rounded-xl border border-border p-4 md:p-5">
          <h2 class="text-sm font-semibold text-text-primary">
            {{ t('profile.sectionAccount') }}
          </h2>

          <!-- Email and role are displayed, never edited. PATCH /users/me does not declare them:
               that allow-list is the privilege boundary, and a control here would promise an edit
               the server correctly refuses. -->
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-text-secondary">{{ t('profile.fieldEmail') }}</span>
              <p class="min-h-10.5 rounded-lg bg-surface-alt px-3 py-2.5 text-sm text-text-secondary">
                {{ profile?.email }}
              </p>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-text-secondary">{{ t('profile.fieldRole') }}</span>
              <p class="min-h-10.5 rounded-lg bg-surface-alt px-3 py-2.5 text-sm text-text-secondary">
                {{ profile?.permitRole ? t(`profile.role.${profile.permitRole}`) : '-' }}
              </p>
            </div>
            <label class="flex flex-col gap-1">
              <span class="text-xs text-text-secondary">{{ t('profile.fieldFirstName') }}</span>
              <input
                v-model="form.firstName"
                class="min-h-10.5 rounded-lg border border-border px-3 text-sm"
                type="text"
                required>
            </label>
            <label class="flex flex-col gap-1">
              <span class="text-xs text-text-secondary">{{ t('profile.fieldLastName') }}</span>
              <input
                v-model="form.lastName"
                class="min-h-10.5 rounded-lg border border-border px-3 text-sm"
                type="text"
                required>
            </label>
            <label class="flex flex-col gap-1">
              <span class="text-xs text-text-secondary">{{ t('profile.fieldPhone') }}</span>
              <input
                v-model="form.phoneNumber"
                class="min-h-10.5 rounded-lg border border-border px-3 text-sm"
                inputmode="numeric"
                maxlength="10"
                minlength="10"
                type="tel">
            </label>
            <label class="flex flex-col gap-1">
              <span class="text-xs text-text-secondary">{{ t('profile.fieldPhoneExtend') }}</span>
              <input
                v-model="form.phoneNumberExtend"
                class="min-h-10.5 rounded-lg border border-border px-3 text-sm"
                type="text">
            </label>
          </div>
        </section>

        <!-- Read-only: the business record belongs to the safety officer who provisioned this
             account. Shown so the contractor can see what is on file and ask for a correction. -->
        <section
          v-if="profile?.contractorProfile"
          class="flex flex-col gap-3 rounded-xl border border-border p-4 md:p-5">
          <div>
            <h2 class="text-sm font-semibold text-text-primary">
              {{ t('profile.sectionBusiness') }}
            </h2>
            <p class="text-xs text-text-secondary">
              {{ t('profile.businessReadOnly') }}
            </p>
          </div>
          <dl class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="row in businessRows"
              :key="row.labelKey">
              <dt class="text-xs text-text-secondary">
                {{ t(row.labelKey) }}
              </dt>
              <dd class="text-sm text-text-primary">
                {{ row.value || '-' }}
              </dd>
            </div>
          </dl>
        </section>

        <div>
          <button
            :disabled="saving"
            class="inline-flex h-10.5 items-center justify-center rounded-lg bg-text-primary px-5 text-sm font-semibold
              text-white transition-colors hover:bg-shell-sidebar-hover disabled:opacity-60"
            type="submit">
            {{ t('common.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Skeleton from '@/volt/Skeleton.vue'
import { toast } from '@/plugins/toast'
import { useAuthStore } from '@/stores/Auth'
import { useApiError } from '@/composables/useApiError'
import { useDayjs } from '@/utils/Dayjs'
import UserProvider, { type IUserProvider } from '@/resources/provider/user/User.provider'
import type { IUserAccount } from '@/models/response/user/UserRes.model'

const { t } = useI18n()
const { mapError } = useApiError()
const { formatDate } = useDayjs()
const authStore = useAuthStore()

const UserService: IUserProvider = new UserProvider()

const profile: Ref<IUserAccount | null> = ref(null)
const loading: Ref<boolean> = ref(false)
const saving: Ref<boolean> = ref(false)
const errorMessage: Ref<string> = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  phoneNumberExtend: ''
})

const businessRows: ComputedRef<{ labelKey: string, value: string }[]> = computed((): { labelKey: string, value: string }[] => {
  const record = profile.value?.contractorProfile
  if (!record) return []
  return [
    { labelKey: 'profile.fieldFirmName', value: record.firmName ?? '' },
    { labelKey: 'profile.fieldTaxId', value: record.taxId ?? '' },
    { labelKey: 'profile.fieldAddress', value: record.address ?? '' },
    { labelKey: 'profile.fieldContactPerson', value: record.contactPerson ?? '' },
    { labelKey: 'profile.fieldContractStart', value: record.contractStart ? formatDate(record.contractStart) : '' },
    { labelKey: 'profile.fieldContractEnd', value: record.contractEnd ? formatDate(record.contractEnd) : '' }
  ]
})

function hydrate (account: IUserAccount): void {
  profile.value = account
  form.firstName = account.firstName ?? ''
  form.lastName = account.lastName ?? ''
  form.phoneNumber = account.phoneNumber ?? ''
  form.phoneNumberExtend = account.phoneNumberExtend ?? ''
}

async function fetchProfile (): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await UserService.me()
    hydrate(response.data)
  } catch (error) {
    // Localized off errorCode. The backend's `message` is never rendered.
    errorMessage.value = mapError(error).message
  } finally {
    loading.value = false
  }
}

async function save (): Promise<void> {
  saving.value = true
  errorMessage.value = ''
  try {
    const response = await UserService.updateMe({
      firstName: form.firstName,
      lastName: form.lastName,
      // The API validates phoneNumber as exactly 10 characters, so an empty field is omitted
      // rather than sent as '' — omitted means unchanged, which is what someone who never
      // filled it in expects.
      phoneNumber: form.phoneNumber || undefined,
      phoneNumberExtend: form.phoneNumberExtend || null
    })
    hydrate(response.data)

    // Keep the drawer's account card in step without a reload.
    authStore.updateUser({ firstName: response.data.firstName ?? '', lastName: response.data.lastName ?? '' })

    toast.success(t('profile.savedToast'))
  } catch (error) {
    errorMessage.value = mapError(error).message
  } finally {
    saving.value = false
  }
}

onMounted((): void => {
  void fetchProfile()
})
</script>

<style scoped></style>
