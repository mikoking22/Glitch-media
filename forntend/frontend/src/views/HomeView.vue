<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter() // 2. agar bisa pindah halaman
const username = ref('')
const password = ref('')

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
      alert('Selamat datang, ' + data.user.username + '!')
      // 3. Pindah halaman diletakkan tepat di sini
      router.push('/dashboard') 
    } else {
      alert('Login Gagal: ' + data.message)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Waduh, servernya belum nyala nih!')
  }
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
      <div class="p-8">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-black text-gray-800 tracking-tight">Glitch Media<span class="text-blue-600">.</span></h1>
          <p class="text-gray-500 mt-2">Selamat datang kembali, silakan masuk.</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1 ml-1">Username</label>
            <input v-model="username" type="text" placeholder="Masukkan username plenger kamu..." 
              class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-hidden transition-all" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
            <input v-model="password" type="password" placeholder="••••••••" 
              class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-hidden transition-all" />
          </div>

          <button @click="handleLogin" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-200 transform hover:-translate-y-0.5 active:scale-95 transition-all mt-6">
            Masuk Sekarang
          </button>
        </div>

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