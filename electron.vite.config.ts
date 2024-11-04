import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        'src/curse_client': resolve(__dirname, 'src/curse_client'),
        'src/types': resolve(__dirname, 'src/types')
      }
    },
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 3000
    }
  }
})
