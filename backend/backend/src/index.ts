import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { cors } from 'hono/cors'
import { sql, and, eq } from 'drizzle-orm'
import { users, posts } from './db/schema'

// ====== TIPE ENVIRONMENT ======
// Mendefinisikan binding Cloudflare D1 yang diakses via c.env.DB
type Bindings = {
  DB: D1Database
}

// ====== INISIALISASI APP ======
const app = new Hono<{ Bindings: Bindings }>()

// ====== MIDDLEWARE: CORS ======
// Mengizinkan request dari frontend (localhost:5173 = Vite dev server)
app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
}))


// ==========================================
// RUTE: POST /login
// Fungsi: Autentikasi user berdasarkan username & password
// Body  : { username: string, password: string }
// Return: 200 + data user jika cocok | 401 jika gagal
// ==========================================
// [CATATAN KEAMANAN] Password dibandingkan secara plaintext.
// Untuk produksi, gunakan bcrypt atau hashing agar lebih aman.
app.post('/login', async (c) => {
  const { username, password } = await c.req.json()
  const db = drizzle(c.env.DB)

  // Cari user yang cocok dengan username DAN password
  const user = await db.select().from(users)
    .where(and(eq(users.username, username), eq(users.password, password))).get()

  if (user) return c.json({ message: 'Login Berhasil', user })
  return c.json({ message: 'Username atau Password salah!' }, 401)
})


/// ==========================================
// RUTE: GET /posts
// Fungsi: Ambil semua postingan UTAMA (bukan balasan) dalam 24 jam terakhir
// ==========================================
app.get('/posts', async (c) => {
  const db = drizzle(c.env.DB)

  // Filter: Waktu 24 jam terakhir DAN parent_id harus NULL (artinya post utama)
  const results = await db.select().from(posts)
    .where(
      and(
        sql`created_at >= datetime('now', '-1 day')`,
        sql`parent_id IS NULL` // <-- Tambahkan baris ini
      )
    )
    .orderBy(sql`created_at DESC`).all()

  return c.json(results)
})

// --- RUTE KIRIM POSTINGAN / BALASAN ---
app.post('/posts', async (c) => {
  const { username, content, parent_id } = await c.req.json(); // Tambahkan parent_id di sini
  const db = drizzle(c.env.DB);

  await db.insert(posts).values({
    username: username,
    content: content,
    parent_id: parent_id ? Number(parent_id) : null, // Simpan ID post utama jika ini adalah balasan
  }).run();

  return c.json({ message: 'Post sukses!' }, 201);
});

// ==========================================
// RUTE: PUT /posts/:id
// Fungsi: Edit isi postingan berdasarkan ID
// Param : id (URL param)
// Body  : { username: string, content: string }
// Return: 200 jika berhasil | 403 jika bukan pemilik post
// ==========================================
app.put('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const { username, content } = await c.req.json()
  const db = drizzle(c.env.DB)

  // Update hanya jika ID dan username cocok (mencegah edit post orang lain)
  const result = await db.update(posts).set({ content })
    .where(and(eq(posts.id, Number(id)), eq(posts.username, username))).run()

  // meta.changes === 0 berarti tidak ada baris yang terupdate (akses ditolak / ID salah)
  if (result.meta.changes === 0) return c.json({ message: 'Gagal edit' }, 403)
  return c.json({ message: 'Berhasil diperbarui!' })
})


// ==========================================
// RUTE: GET /posts/:id
// Fungsi: Ambil detail satu postingan berdasarkan ID
// Param : id (URL param)
// Return: Object post | undefined jika tidak ditemukan
// ==========================================
app.get('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const db = drizzle(c.env.DB)

  const result = await db.select().from(posts).where(eq(posts.id, Number(id))).get()
  return c.json(result)
})


// ==========================================
// RUTE: GET /posts/:id/replies
// Fungsi: Ambil semua balasan untuk postingan tertentu
// Param : id → ID post induk (parent)
// Return: Array of reply posts, diurutkan dari yang terlama (ASC).

app.get('/posts/:id/replies', async (c) => {
  const id = c.req.param('id')
  const db = drizzle(c.env.DB)

  // Ambil semua post yang memiliki parent_id sesuai dengan ID yang diberikan
  const results = await db.select().from(posts)
    .where(sql`parent_id = ${Number(id)}`)
    .orderBy(sql`created_at ASC`).all()

  return c.json(results)
})


// ==========================================
// RUTE: DELETE /posts/:id
// Fungsi: Hapus postingan berdasarkan ID
// Param : id (URL param)
// Body  : { username: string }
// Return: 200 jika berhasil | 403 jika bukan pemilik post
// ==========================================
app.delete('/posts/:id', async (c) => {
  const id = c.req.param('id')
  const { username } = await c.req.json()
  const db = drizzle(c.env.DB)

  // Hapus hanya jika ID dan username cocok (mencegah hapus post orang lain)
  const result = await db.delete(posts)
    .where(and(eq(posts.id, Number(id)), eq(posts.username, username))).run()

  // meta.changes === 0 berarti tidak ada baris yang terhapus
  if (result.meta.changes === 0) return c.json({ message: 'Gagal hapus' }, 403)
  return c.json({ message: 'Terhapus!' })

  
})

export default app