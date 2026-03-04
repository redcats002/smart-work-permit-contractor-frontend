export interface IFormState {
  [key: string]: {
    invalid?: boolean
    error?: { message?: string }
    errors?: Array<{ message?: string }>
  }
}
