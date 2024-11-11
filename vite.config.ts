import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') } // 修正此行，去掉开头的斜杠
    ],
  },
  plugins: [reactRefresh()],
});
