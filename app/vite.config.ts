import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { parse } from 'yaml'

// Parses .yaml files at build time so the YAML parser never ships to the browser.
function yaml(): Plugin {
  return {
    name: 'yaml',
    transform(code, id) {
      if (!/\.ya?ml$/.test(id)) return
      return { code: `export default ${JSON.stringify(parse(code))}`, map: null }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), yaml()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
