import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'test.html'  // Tell Vite to use test.html as entry point
    }    
  }
});