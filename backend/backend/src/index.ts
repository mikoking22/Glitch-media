import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { cors } from 'hono/cors'
import { sql, and, eq } from 'drizzle-orm'
import { users, posts } from './db/schema'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Tambahkan DELETE di allowMethods agar fitur hapus diizinkan browser
app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
}))

// --- LOGIN ---
app.post('/login', async (c) => {
  const { username, password } = await c.req.json()
  const db = drizzle(c.env.DB)
  const user = await db.select().from(users)
    .where(and(eq(users.username, username), eq(users.password, password))).get()
  if (user) return c.json({ message: 'Login Berhasil', user })
  return c.json({ message: 'Username atau Password salah!' }, 401)
})

// --- AMBIL POSTINGAN (DENGAN PERBAIKAN FILTER 24 JAM) ---
app.get('/posts', async (c) => {
  const db = drizzle(c.env.DB)
  // Gunakan filter SQLite yang benar untuk menghapus chat > 24 jam secara otomatis dari tampilan
  const results = await db.select().from(posts)
    .where(sql`created_at >= datetime('now', '-1 day')`)
    .orderBy(sql`created_at DESC`).all()
  return c.json(results)
})

// --- KIRIM POSTINGAN ---
app.post('/posts', async (c) => {
  const { username, content } = await c.req.json()
  const db = drizzle(c.env.DB)
  await db.insert(posts).values({ username, content }).run()
  return c.json({ message: 'Post sukses!' }, 201)
})

// --- EDIT POSTINGAN ---
app.put('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const { username, content } = await c.req.json()
  const db = drizzle(c.env.DB)
  const result = await db.update(posts).set({ content })
    .where(and(eq(posts.id, Number(id)), eq(posts.username, username))).run()
  if (result.meta.changes === 0) return c.json({ message: 'Gagal edit' }, 403)
  return c.json({ message: 'Berhasil diperbarui!' })
})

// --- HAPUS POSTINGAN ---
app.delete('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const { username } = await c.req.json()
  const db = drizzle(c.env.DB)
  const result = await db.delete(posts)
    .where(and(eq(posts.id, Number(id)), eq(posts.username, username))).run()
  if (result.meta.changes === 0) return c.json({ message: 'Gagal hapus' }, 403)
  return c.json({ message: 'Terhapus!' })
})

export default app