<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Password dan Konfirmasi Password tidak cocok!')
    return
  }

  isLoading.value = true
  try {
    // URL SUDAH DIARAHKAN KE CLOUDFLARE WORKERS PRODUCTION
    const response = await fetch('https://backend.misbachussurur8.workers.dev/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      alert('Registrasi Berhasil! Silakan masuk.')
      router.push('/') // Pindah ke halaman login setelah sukses
    } else {
      alert('Gagal: ' + data.message)
    }
  } catch (error) {
    alert('Waduh, ada masalah koneksi ke server Cloudflare Workers.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
      <div class="p-8">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-black text-gray-800 tracking-tight">Join <span class="text-blue-600">Glitch.</span></h1>
          <p class="text-gray-500 mt-2">Buat akun barumu sekarang.</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1 ml-1">Username</label>
            <input v-model="username" type="text" placeholder="Pilih username unikmu..." required
              class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
            <input v-model="password" type="password" placeholder="Minimal 6 karakter..." required
              class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1 ml-1">Konfirmasi Password</label>
            <input v-model="confirmPassword" type="password" placeholder="Ketik ulang password..." required
              class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
          </div>

          <button type="submit" :disabled="isLoading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95 disabled:opacity-50">
            {{ isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang' }}
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-gray-500">Sudah punya akun? 
            <router-link to="/" class="text-blue-600 font-bold hover:underline">Masuk di sini</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>