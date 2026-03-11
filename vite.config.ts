import Tailwindcss from '@tailwindcss/vite'
import Vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import ESLint from 'vite-plugin-eslint2'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		Vue(),
		ESLint(),
		Tailwindcss(),
		Components({
			dirs: ['src/volt'],
			dts: true
		})
	],

	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
		extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
	},

	define: {
		'process.env': {}
	},

	server: {
		host: '0.0.0.0',
		port: 8080,
		strictPort: false,
		watch: {
			usePolling: true
		}
	}
})
