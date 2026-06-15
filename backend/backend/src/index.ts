import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { cors } from 'hono/cors'
import { sql, and, eq } from 'drizzle-orm'
import { users, posts } from './db/schema'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors({
  origin: '*', 
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
}))

// ==========================================
// UTILITY: Fungsi Enkripsi SHA-256 Hash
// ==========================================
async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ==========================================
// RUTE: POST /register (SUDAH DENGAN HASH)
// ==========================================
app.post('/register', async (c) => {
  const db = drizzle(c.env.DB)

  try {
    const body = await c.req.json()
    const { username, password } = body

    if (!username || !password) {
      return c.json({ message: 'Username dan password wajib diisi!' }, 400)
    }

    const userExist = await db.select().from(users)
      .where(eq(users.username, username))
      .get()

    if (userExist) {
      return c.json({ message: 'Username sudah digunakan, cari yang lain!' }, 400)
    }

    // Ubah password menjadi Hash SHA-256 sebelum disimpan ke D1
    const hashedPassword = await hashPassword(password)

    await db.insert(users).values({
      username,
      password: hashedPassword
    }).run()

    return c.json({ message: 'Registrasi akun berhasil!' }, 201)

  } catch (error) {
    return c.json({ message: 'Terjadi kesalahan sistem saat registrasi!' }, 500)
  }
})

// ==========================================
// RUTE: POST /login (SUDAH DENGAN HASH MATCHING)
// ==========================================
app.post('/login', async (c) => {
  const db = drizzle(c.env.DB)
  
  try {
    const body = await c.req.json()
    const { username, password } = body
    
    // 1. Cari user berdasarkan username saja terlebih dahulu
    const user = await db.select().from(users)
      .where(eq(users.username, username)).get()

    if (!user) {
      return c.json({ message: 'Username atau Password salah!' }, 401)
    }

    // 2. Hash password yang diketik dari frontend
    const inputPasswordHashed = await hashPassword(password)

    // 3. Cocokkan hash buatan baru dengan hash yang ada di database
    if (user.password !== inputPasswordHashed) {
      return c.json({ message: 'Username atau Password salah!' }, 401)
    }

    return c.json({ message: 'Login Berhasil', user })

  } catch (error) {
    return c.json({ message: 'Format data JSON rusak atau kosong!' }, 400)
  }
})

// --- RUTE GET /posts ---
app.get('/posts', async (c) => {
  const db = drizzle(c.env.DB)
  const results = await db.select().from(posts)
    .where(and(sql`created_at >= datetime('now', '-1 day')`, sql`parent_id IS NULL`))
    .orderBy(sql`created_at DESC`).all()
  return c.json(results)
})

// --- RUTE POST /posts ---
app.post('/posts', async (c) => {
  const { username, content, parent_id } = await c.req.json()
  const db = drizzle(c.env.DB)
  await db.insert(posts).values({
    username,
    content,
    parent_id: parent_id ? Number(parent_id) : null
  }).run()
  return c.json({ message: 'Post sukses!' }, 201)
})

// --- RUTE PUT /posts/:id ---
app.put('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const { username, content } = await c.req.json()
  const db = drizzle(c.env.DB)
  const result = await db.update(posts).set({ content })
    .where(and(eq(posts.id, Number(id)), eq(posts.username, username))).run()
  if (result.meta.changes === 0) return c.json({ message: 'Gagal edit' }, 403)
  return c.json({ message: 'Berhasil diperbarui!' })
})

// --- RUTE GET /posts/:id ---
app.get('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const db = drizzle(c.env.DB)
  const result = await db.select().from(posts).where(eq(posts.id, Number(id))).get()
  return c.json(result)
})

// --- RUTE GET /posts/:id/replies ---
app.get('/posts/:id/replies', async (c) => {
  const id = c.req.param('id')
  const db = drizzle(c.env.DB)
  const results = await db.select().from(posts)
    .where(sql`parent_id = ${Number(id)}`)
    .orderBy(sql`created_at ASC`).all()
  return c.json(results)
})

// --- RUTE DELETE /posts/:id ---
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