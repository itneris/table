import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts', // Entry point of your library
      name: 'ItnTable', // Global name for your UMD build
      fileName: (format) => `itn-table.${format}.js`,
    },
    rollupOptions: {
      // Ensure to mark react and react-dom as external
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});