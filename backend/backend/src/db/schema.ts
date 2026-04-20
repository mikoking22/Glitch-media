import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Tabel User: Untuk menyimpan data akun
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
});

// Tabel Posts: Untuk menyimpan postingan sosmed
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

// Tabel Comments: Untuk komentar di setiap postingan
export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  text: text('text').notNull(),
  postId: integer('post_id').references(() => posts.id),
  userId: integer('user_id').references(() => users.id),
});