import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8888/openapi.json',
  output: './src/lib/api-client',
  plugins: ['@hey-api/client-fetch'],
});
