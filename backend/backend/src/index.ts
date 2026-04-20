import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { users } from './db/schema'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.text('API Sosmed Berhasil Jalan!')
})

// 1. Endpoint untuk Register (Tambah User Baru)
app.get('/add-user', async (c) => {
  const db = drizzle(c.env.DB)
  const username = c.req.query('name') || 'User Baru'
  
  try {
    await db.insert(users).values({
      username: username,
      password: 'password123' // Contoh sederhana
    }).run()
    
    return c.text(`User ${username} berhasil didaftarkan!`)
  } catch (e) {
    return c.text('Gagal daftar (mungkin username sudah ada)', 500)
  }
})

// 2. Endpoint untuk Cek Semua User
app.get('/users', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(users).all()
  return c.json(result)
})

export default app