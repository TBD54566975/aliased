import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Vite plugin for polyfills for Node.js libraries in browsers.
// See https://www.npmjs.com/package/vite-plugin-node-stdlib-browser for detail.
// NOTE: node-stdlib-browser is a dependency of vite-plugin-node-stdlib-browser that needs manual installation.
import viteNodePolyfills from 'vite-plugin-node-stdlib-browser';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteNodePolyfills(),
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
