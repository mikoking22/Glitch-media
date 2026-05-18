<template>
  <div class="flex flex-col h-screen bg-gray-50 font-sans">
    <header class="bg-white p-4 shadow-sm z-10 border-b-2 border-blue-600 flex justify-between items-center">
      <h1 class="text-xl font-black italic tracking-tighter">GLITCH<span class="text-blue-600">.</span>FLASH</h1>
      <div class="flex items-center gap-3">
        <span class="text-[10px] font-bold text-blue-600 uppercase">@{{ userAktif }}</span>
        <button @click="logout" class="text-[10px] font-bold text-red-500 uppercase tracking-widest border border-red-200 px-2 py-1 rounded-md hover:bg-red-50">Keluar</button>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-4 pb-32">
      <div class="max-w-xl mx-auto space-y-4">
        
        <div v-if="listPost.length === 0" class="text-center py-20 text-gray-300 italic">
          Belum ada kabar kilat... Jadilah yang pertama!
        </div>

        <div v-for="p in listPost" :key="p.id" 
          class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-500 animate-in fade-in slide-in-from-bottom-2">
          
          <div class="flex justify-between items-center mb-2">
            <span class="font-black text-blue-600 text-xs italic">@{{ p.username }}</span>
            <div class="flex items-center gap-3">
              <span class="text-[9px] font-bold text-gray-400">{{ formatWaktu(p.created_at) }}</span>
              
              <div class="flex items-center gap-2">
                <button 
                  v-if="p.username === userAktif && isEditing !== p.id" 
                  @click="mulaiEdit(p)"
                  class="text-[9px] font-extrabold text-blue-500 hover:underline uppercase"
                >
                  Edit
                </button>

                <button 
                  v-if="p.username === userAktif && isEditing !== p.id" 
                  @click="hapusPost(p.id)"
                  class="text-[9px] font-extrabold text-red-500 hover:underline uppercase"
                >
                  Hapus
                </button>

                <button 
                  @click="router.push(`/reply/${p.id}`)"
                  class="text-[9px] font-extrabold text-gray-500 hover:underline uppercase"
                >
                  Balas
                </button>
              </div>
            </div>
          </div>

          <div v-if="isEditing === p.id" class="space-y-2">
            <textarea 
              v-model="editContent" 
              class="w-full p-2 text-sm bg-gray-50 border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
            <div class="flex gap-2">
              <button @click="simpanEdit(p.id)" class="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-bold">Simpan</button>
              <button @click="isEditing = null" class="text-[10px] bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-bold">Batal</button>
            </div>
          </div>

          <p v-else class="text-gray-800 text-md leading-relaxed">{{ p.content }}</p>
        </div>
        
      </div>
    </main>

    <footer class="bg-white p-4 border-t shadow-[0_-5px_15px_rgba(0,0,0,0.05)] fixed bottom-0 w-full">
      <div class="max-w-xl mx-auto flex items-end gap-2">
        <textarea 
          v-model="newPost" 
          rows="1"
          placeholder="Ketik kabar kilat..." 
          class="flex-1 bg-gray-100 rounded-2xl p-3 border-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          @keyup.enter.exact="kirimPost"
        ></textarea>
        <button 
          @click="kirimPost" 
          class="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-transform active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
      <p class="text-[8px] text-center text-gray-400 mt-2 font-bold uppercase">Postingan akan terhapus otomatis dalam 24 jam</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const newPost = ref('')
const listPost = ref([])
const userAktif = localStorage.getItem('username') || 'Anonymous'

// 1. FUNGSI AMBIL DATA (GET) - SUDAH FIX WORKERS
const ambilBerita = async () => {
  try {
    const r = await fetch('https://backend.misbachussurur8.workers.dev/posts')
    if (r.ok) {
      listPost.value = await r.json()
    }
  } catch (e) { 
    console.error("Gagal sinkronisasi data") 
  }
}

// 2. FUNGSI KIRIM DATA (POST) - SUDAH FIX WORKERS
const kirimPost = async () => {
  if(!newPost.value.trim()) return
  try {
    await fetch('https://backend.misbachussurur8.workers.dev/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: userAktif, 
        content: newPost.value 
      })
    })
    newPost.value = ''
    ambilBerita() 
  } catch (err) {
    console.error("Gagal kirim pesan")
  }
}

const isEditing = ref(null);
const editContent = ref('');
const mulaiEdit = (post) => {
  isEditing.value = post.id;
  editContent.value = post.content;
};

// 3. FUNGSI HAPUS DATA (DELETE) - SUDAH FIX WORKERS
const hapusPost = async (id) => {
  if (!confirm("Yakin ingin menghapus pesan ini?")) return;
  try {
    const res = await fetch(`https://backend.misbachussurur8.workers.dev/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userAktif })
    });
    if (res.ok) ambilBerita();
    else alert("Gagal menghapus!");
  } catch (e) {
    console.error("Error hapus");
  }
};

// 4. FUNGSI SIMPAN EDIT (PUT) - SUDAH FIX WORKERS
const simpanEdit = async (id) => {
  if (!editContent.value.trim()) return;
  try {
    const res = await fetch(`https://backend.misbachussurur8.workers.dev/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: userAktif, 
        content: editContent.value 
      })
    });
    if (res.ok) {
      isEditing.value = null;
      ambilBerita();
    } else {
      alert("Kamu tidak punya akses mengedit ini!");
    }
  } catch (e) {
    console.error("Gagal edit");
  }
};

const formatWaktu = (tgl) => {
  if (!tgl) return '--:--'
  const d = new Date(tgl)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const logout = () => {
  localStorage.removeItem('username')
  router.push('/')
}

onMounted(() => {
  ambilBerita()
  setInterval(ambilBerita, 30000)
})
</script>