export default {
  '*.{js,jsx,ts,tsx,vue}': [
    'eslint --fix',
    () => 'bunx vitest run'
  ]
}
