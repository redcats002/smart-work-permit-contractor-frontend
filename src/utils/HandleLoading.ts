import type { Ref } from 'vue'
import { toast } from '@/plugins/toast'
import { useLoadingStore } from '@/stores/Loading'
import type { TErrorResponse } from '@/models/response/Response.model'
import { handleSubmit } from './HandleSubmit'

interface handleLoadingOptions {
  loadingUnit?: Ref<boolean>
  formRef?: Ref<any>
}

/**
 * Sets the loading state in the application.
 *
 * This function can update a local loading state or interact with a global store to manage the loading status.
 *
 * @param isLoading - A boolean indicating whether to set the loading state to true or false.
 * @param loadingUnit - An optional `Ref<boolean>` to control the local loading state. If not provided, global loading state is updated.
 */
function setIsLoading (
  isLoading: boolean,
  loadingUnit?: Ref<boolean>
): void {
  if (loadingUnit) {
    loadingUnit.value = isLoading
    return
  }
  const loadingStore = useLoadingStore()
  return isLoading
    ? loadingStore.addLoading()
    : loadingStore.removeLoading()
}

function addLoading (loadingUnit?: Ref<boolean>): void {
  setIsLoading(true, loadingUnit)
}
function removeLoading (loadingUnit?: Ref<boolean>): void {
  setIsLoading(false, loadingUnit)
}

function getErrorMessage (e: any): string {
  const d = e?.response?.data ?? e

  if (typeof d === 'string') return d
  if (typeof d?.message === 'string') return d.message

  const m = d?.message
  if (m) return m.summary || m.message || m.errors?.[0]?.summary || m.errors?.[0]?.message

  return 'เกิดข้อผิดพลาด'
}

/**
 * Handles loading state and performs an async operation, with optional toast notifications and form validation.
 *
 * @param callBack - The async operation to execute (e.g., an API call).
 * @param options - An object containing optional settings for handling the operation:
 *   - `loadingUnit` (optional): A `Ref<boolean>` for tracking the loading state.
 *   - `formRef` (optional): A reference to the form object for validation before the operation.
 * @param errorCallBack - A callback to handle errors if the async operation fails.
 *
 * @returns A promise that resolves when the async operation completes.
 *
 * @example
 * handleLoading(submitForm, {
 *   loadingUnit: isLoadingRef,
 *   formRef: formRef
 * }, (error) => {
 *   console.error('Submission failed', error);
 * });
 */
export async function handleLoading<T> (
  callBack: (...args: any) => T,
  {
    loadingUnit,
    formRef
  }: handleLoadingOptions = {},
  errorCallBack: (error?: TErrorResponse) => TErrorResponse = (error?: TErrorResponse): void => {
    toast.error(getErrorMessage(error))
    console.error(error)
  }
): Promise<Awaited<T> | undefined> {
  try {
    addLoading(loadingUnit)
    const valid = await handleSubmit(formRef)
    if (!valid) return
    const result = await callBack()
    return result
  } catch (error: any) {
    errorCallBack(error)
  } finally {
    removeLoading(loadingUnit)
  }
}

export default { handleLoading }
