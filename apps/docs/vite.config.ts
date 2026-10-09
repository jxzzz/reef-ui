import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 直接用组件源码，源码内的 css import 才会生效（dist 产物的 css 需要手动引入），
      // 同时文档站改组件即时热更新，无需先 build
      '@reef-ui/components': fileURLToPath(
        new URL('../../packages/components/src/index.ts', import.meta.url),
      ),
    },
  },
});
