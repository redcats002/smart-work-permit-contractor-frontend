const REQUIRED_ENV_KEYS: string[] = [
  'VITE_APP_API_URL'
]

export function checkEnv (): void {
  const missing: string[] = []

  for (const key of REQUIRED_ENV_KEYS) {
    const value: string | undefined = import.meta.env[key]
    if (value === undefined || value === '') {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    const message: string = [
      'Missing required environment variables:',
      ...missing.map((key: string): string => `  - ${key}`)
    ].join('\n')
    throw new Error(message)
  }
}
