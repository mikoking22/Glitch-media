<template>
  <div class="flex flex-col h-screen bg-gray-50 font-sans">
    <header class="bg-white p-4 shadow-sm z-10 border-b-2 border-blue-600 flex items-center gap-4">
      <button @click="router.push('/dashboard')" class="text-xs font-black text-blue-600 hover:underline uppercase tracking-wider">
        ⬅ Kembali
      </button>
      <h1 class="text-md font-black italic tracking-tighter flex-1 text-center mr-16">
        RUANG BALASAN<span class="text-blue-600">.</span>FLASH
      </h1>
    </header>

    <main class="flex-1 overflow-y-auto p-4 pb-32">
      <div class="max-w-xl mx-auto space-y-6">
        
        <div v-if="postUtama" class="bg-blue-50 p-5 rounded-2xl border-2 border-blue-200 shadow-sm">
          <div class="flex justify-between items-center mb-2">
            <span class="font-black text-blue-700 text-xs italic">@{{ postUtama.username }}</span>
            <span class="text-[9px] font-bold text-gray-400">{{ formatWaktu(postUtama.created_at) }}</span>
          </div>
          <p class="text-gray-900 text-md leading-relaxed font-medium">{{ postUtama.content }}</p>
        </div>

        <div class="border-b-2 border-dashed border-gray-200 my-4 text-center">
          <span class="bg-gray-50 px-3 text-xs font-bold text-gray-400 tracking-widest uppercase">Balasan Kilat</span>
        </div>

        <div v-if="listReplies.length === 0" class="text-center py-10 text-gray-300 italic text-sm">
          Belum ada balasan... Kirim respon kilatmu di bawah!
        </div>

        <div v-for="reply in listReplies" :key="reply.id" 
          class="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-gray-400">
          <div class="flex justify-between items-center mb-1">
            <span class="font-black text-gray-600 text-xs italic">@{{ reply.username }}</span>
            <span class="text-[9px] font-bold text-gray-400">{{ formatWaktu(reply.created_at) }}</span>
          </div>
          <p class="text-gray-800 text-sm leading-relaxed">{{ reply.content }}</p>
        </div>

      </div>
    </main>

    <footer class="bg-white p-4 border-t shadow-[0_-5px_15px_rgba(0,0,0,0.05)] fixed bottom-0 w-full">
      <div class="max-w-xl mx-auto flex items-end gap-2">
        <textarea 
          v-model="newReply" 
          rows="1"
          :placeholder="`Balas kilat @${postUtama?.username || ''}...`" 
          class="flex-1 bg-gray-100 rounded-2xl p-3 border-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          @keyup.enter.exact="kirimBalasan"
        ></textarea>
        <button 
          @click="kirimBalasan" 
          class="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-transform active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const postUtama = ref(null)
const listReplies = ref([])
const newReply = ref('')
const userAktif = localStorage.getItem('username') || 'Anonymous'

// Ambil ID postingan dari URL param (:id)
const postId = route.params.id

const ambilDataHalaman = async () => {
  try {
    // URL SUDAH DIARAHKAN KE CLOUDFLARE WORKERS PRODUCTION
    const resPost = await fetch(`https://backend.misbachussurur8.workers.dev/posts/${postId}`)
    if (resPost.ok) postUtama.value = await resPost.json()

    // URL SUDAH DIARAHKAN KE CLOUDFLARE WORKERS PRODUCTION
    const resReplies = await fetch(`https://backend.misbachussurur8.workers.dev/posts/${postId}/replies`)
    if (resReplies.ok) listReplies.value = await resReplies.json()
  } catch (e) {
    console.error("Gagal memuat data balasan:", e)
    alert('Gagal memuat halaman balasan. Cek koneksi backend Cloudflare.')
  }
}

const kirimBalasan = async () => {
  if (!newReply.value.trim()) return
  try {
    // URL SUDAH DIARAHKAN KE CLOUDFLARE WORKERS PRODUCTION
    const res = await fetch('https://backend.misbachussurur8.workers.dev/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: userAktif,
        content: newReply.value,
        parent_id: Number(postId)
      })
    })
    if (res.ok) {
      newReply.value = ''
      await ambilDataHalaman()
    } else {
      alert('Gagal mengirim balasan!')
    }
  } catch (err) {
    console.error("Gagal membalas pesan")
    alert('Server Cloudflare tidak bisa dijangkau!')
  }
}

const formatWaktu = (tgl) => {
  if (!tgl) return '--:--'
  const d = new Date(tgl)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  ambilDataHalaman()
  // Auto-refresh data tiap 10 detik
  setInterval(ambilDataHalaman, 10000)
})
</script>