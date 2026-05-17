import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts', // Kembalikan ke asal tanpa tulisan backend/
  out: './migrations',
  dialect: 'sqlite',
});