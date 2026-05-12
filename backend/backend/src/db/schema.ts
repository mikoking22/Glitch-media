import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Tabel User: Untuk menyimpan data akun
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
});

// Tabel Posts: Gabungkan semua kolom yang kita butuhkan di sini
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(), // Menyimpan nama pengirim
  content: text('content').notNull(),    // Isi postingan
  userId: integer('user_id').references(() => users.id), // Relasi ke user
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`), // Waktu untuk filter 24 jam
});

// Tabel Comments
export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  text: text('text').notNull(),
  postId: integer('post_id').references(() => posts.id),
  userId: integer('user_id').references(() => users.id),
});