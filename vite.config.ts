import { defineConfig } from 'vite';
import { config } from 'vitest/config';

export default defineConfig({
  plugins: [
    // Your other Vite plugins here
  ],
  test: {
    // Test-specific configurations
    globals: true,
    environment: 'jsdom',
  },
});
