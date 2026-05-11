import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { users } from './db/schema'
import { cors } from 'hono/cors'
import { eq, and } from 'drizzle-orm' // Pindahkan ke atas sini

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors({
  origin: 'http://localhost:5173', 
  allowMethods: ['POST', 'GET', 'OPTIONS'],
}))

// --- ROUTE LOGIN ---
app.post('/login', async (c) => {
  const { username, password } = await c.req.json()
  const db = drizzle(c.env.DB)

  const user = await db.select()
    .from(users)
    .where(
      and(
        eq(users.username, username),
        eq(users.password, password)
      )
    )
    .get()

  if (user) {
    return c.json({
      message: 'Login Berhasil',
      user: user
    })
  }

  return c.json({ message: 'Username atau Password salah!' }, 401)
})

// --- ROUTE REGISTER ---
app.post('/register', async (c) => {
  try {
    const { username, password } = await c.req.json()
    const db = drizzle(c.env.DB)

    const existingUser = await db.select().from(users).where(eq(users.username, username)).get()
    
    if (existingUser) {
      return c.json({ message: 'Username sudah terdaftar!' }, 400)
    }

    await db.insert(users).values({
      username,
      password,
    })

    return c.json({ message: 'Registrasi Berhasil! Silakan Login.' }, 201)
  } catch (err) {
    return c.json({ message: 'Gagal daftar, coba lagi nanti.' }, 500)
  }
})

// --- ROUTE TESTING (Bisa dihapus jika sudah tidak dipakai) ---
app.get('/', (c) => {
  return c.text('API Sosmed Berhasil Jalan!')
})

app.get('/users', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(users).all()
  return c.json(result)
})

export default app