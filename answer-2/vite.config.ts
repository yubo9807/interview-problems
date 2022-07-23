import vuePlugin from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [
    vuePlugin(),
  ],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
