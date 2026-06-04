import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig({
  ...viteConfig,
  test: {
    environment: 'jsdom',
    globals: true,
    passWithNoTests: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'src/tests/automate/**'
    ]
    // projects: [
    //   defineProject({
    //     resolve: {
    //       alias: {
    //         '@': fileURLToPath(new URL('./src', import.meta.url))
    //       }
    //     },
    //     test: {
    //       include: [
    //         'src/**/*.{test,spec}.ts',
    //         'src/**/*.{test,spec}.tsx',
    //         'tests/unit/**/*.{test,spec}.ts',
    //         'tests/**/*.unit.{test,spec}.ts',
    //         'tests/**/*.{test,spec}.ts'
    //       ],
    //       exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**'],
    //       name: 'unit',
    //       environment: 'node'
    //     }
    //   }),
    //   defineProject({
    //     resolve: {
    //       alias: {
    //         '@': fileURLToPath(new URL('./src', import.meta.url))
    //       }
    //     },
    //     test: {
    //       include: [
    //         'src/**/*.browser.{test,spec}.ts',
    //         'src/**/*.browser.{test,spec}.tsx',
    //         'tests/browser/**/*.{test,spec}.ts',
    //         'tests/**/*.browser.{test,spec}.ts'
    //       ],
    //       name: 'browser',
    //       browser: {
    //         enabled: true,
    //         provider: playwright(),
    //         instances: [{ browser: 'chromium' }]
    //       }
    //     }
    //   })
    // ]
  }
})
