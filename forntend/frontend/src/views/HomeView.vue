<script setup>
// ====== HALAMAN: LOGIN ======
// Rute: / (root)
// Fungsi: Menerima input username & password, kirim ke backend, lalu navigasi ke /dashboard

import { ref } from 'vue'
import { useRouter } from 'vue-router'

// useRouter: digunakan untuk berpindah halaman secara programatik (tanpa klik link)
const router = useRouter()

// State form login
const username = ref('')  // Dua arah dengan input username di template
const password = ref('')  // Dua arah dengan input password di template

// ====== FUNGSI LOGIN ======
// Dipanggil saat tombol "Masuk Sekarang" diklik
// Mengirim POST /login ke backend dengan { username, password }
const handleLogin = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8787/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      // Login berhasil:
      // 1. Simpan username ke localStorage agar bisa diakses di halaman lain (DashboardView, ReplyView)
      // 2. Navigasi ke halaman utama /dashboard
      alert('Selamat datang, ' + data.user.username + '!')
      localStorage.setItem('username', data.user.username)
      router.push('/dashboard')
    } else {
      // Backend mengembalikan 401: username atau password salah
      alert('Login Gagal: ' + data.message)
    }
  } catch (error) {
    // Gagal connect ke server (backend belum nyala / jaringan bermasalah)
    console.error('Error:', error)
    alert('Waduh, servernya belum nyala nih!')
  }
}
</script>

<template>
  <!-- Halaman login dengan latar gradien biru-ungu -->
  <div class="min-h-screen bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
      <div class="p-8">

        <!-- Judul aplikasi -->
        <div class="text-center mb-10">
          <h1 class="text-4xl font-black text-gray-800 tracking-tight">Glitch Medi<span class="text-blue-600">@</span></h1>
          <p class="text-gray-500 mt-2">Silahkan Login</p>
        </div>

        <div class="space-y-4">

          <!-- Input username: v-model terhubung ke state `username` -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1 ml-1">Username</label>
            <input v-model="username" type="text" placeholder="Masukkan username plenger kamu..."
              class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-hidden transition-all" />
          </div>

          <!-- Input password: type="password" menyembunyikan karakter -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
            <input v-model="password" type="password" placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-hidden transition-all" />
          </div>

          <!-- Tombol login: memanggil handleLogin() saat diklik -->
          <button @click="handleLogin"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-200 transform hover:-translate-y-0.5 active:scale-95 transition-all mt-6">
            Masuk Sekarang
          </button>
        </div>

        <!-- Link ke halaman registrasi -->
        <p class="text-center text-sm text-gray-500 mt-8">
          Belum punya akun?
          <router-link to="/register" class="text-blue-600 font-bold hover:underline">
            Daftar di sini
          </router-link>
        </p>

      </div>
    </div>
  </div>
</template>
