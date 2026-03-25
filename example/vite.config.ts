import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@heojeongbo/log-palette': `${__dirname}../src/index.ts`,
    },
  },
})
