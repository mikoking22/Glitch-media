<script setup>
// ====== HALAMAN: LOGIN WITH DIAGNOSIS ======
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const CLIENT_ID = '877449459178-56h7svjhsod1ao0mjlgfkf1a1qe7bi5n.apps.googleusercontent.com'

// ====== FUNGSI LOGIN MANUAL ======
const handleLogin = async () => {
  try {
    const response = await fetch('https://backend.misbachussurur8.workers.dev/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      alert('Selamat datang, ' + data.user.username + '!')
      localStorage.setItem('username', data.user.username)
      router.push('/dashboard')
    } else {
      alert('Login Gagal: ' + data.message)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Waduh, gagal terhubung ke server backend Cloudflare!')
  }
}

// ====== FUNGSI LOGIN GOOGLE SUCCESS ======
const handleGoogleLoginSuccess = (response) => {
  try {
    const base64Url = response.credential.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    const googleUser = JSON.parse(jsonPayload)
    const usernameDariGoogle = googleUser.given_name.toLowerCase() + Math.floor(Math.random() * 100)

    localStorage.setItem('username', usernameDariGoogle)
    alert(`Selamat Datang, ${googleUser.name}! Login Google berhasil.`)
    router.push('/dashboard')
  } catch (error) {
    alert('Gagal autentikasi via Google Login!')
  }
}

// ====== PENGGERAK TOMBOL PROGRAMATIK (DIAGNOSIS) ======
onMounted(() => {
  // Tunggu 500ms untuk memastikan objek 'google' dipasang sempurna oleh index.html
  setTimeout(() => {
    if (typeof google !== 'undefined' && google.accounts) {
      console.log("Sistem: Memulai Inisialisasi Google SDK secara paksa...")
      
      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogleLoginSuccess,
        auto_select: false
      })

      const targetDiv = document.getElementById("google-signin-btn")
      if (targetDiv) {
        // Gambar tombol secara paksa lewat Javascript murni
        google.accounts.id.renderButton(targetDiv, {
          theme: "outline",
          size: "large",
          width: "320",
          text: "signin_with",
          shape: "rectangular"
        })
        console.log("Sistem: Perintah renderButton sukses dikirim ke browser.")
      }
    } else {
      console.error("Sistem: Objek 'google' gagal diunduh dari internet.")
    }
  }, 500)
})
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
      <div class="p-8">

        <div class="text-center mb-10">
          <h1 class="text-4xl font-black text-gray-800 tracking-tight">Glitch Medi<span class="text-blue-600">@</span></h1>
          <p class="text-gray-500 mt-2">Silahkan Login</p>
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

          <div class="mt-8 flex flex-col items-center justify-center w-full">
            <div class="w-full flex items-center mb-6">
              <div class="flex-1 border-t border-gray-200"></div>
              <span class="px-4 text-xs text-gray-400 font-bold tracking-wider uppercase">Atau</span>
              <div class="flex-1 border-t border-gray-200"></div>
            </div>

            <div id="google-signin-btn" class="min-w-[320px] min-h-[44px] flex justify-center items-center"></div>
          </div>
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