<template>
  <div class="min-h-screen bg-white">
    <nav class="border-b py-2 px-8 flex gap-6 text-xs font-bold uppercase tracking-widest text-gray-600">
      <span class="text-red-600 border-b-2 border-red-600">News</span>
      <span>Sports</span>
      <span>Life</span>
      <span>Money</span>
      <span>Tech</span>
    </nav>

    <main class="p-4 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div class="lg:col-span-3 space-y-6">
          <div class="relative group cursor-pointer overflow-hidden rounded-lg">
            <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c" class="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent text-white">
              <span class="bg-red-600 px-2 py-1 text-xs font-bold uppercase">Breaking News</span>
              <h2 class="text-4xl font-black mt-2 leading-tight">Glitch Media: Transformasi Digital Mahasiswa IT di Tahun 2026</h2>
              <p class="mt-2 text-gray-200">Bagaimana teknologi Cloudflare dan Vue Router mengubah cara kita membangun web...</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="i in 2" :key="i" class="border-b pb-4 flex gap-4">
              <img src="https://images.unsplash.com/photo-1585829365234-78d9b6920784" class="w-24 h-24 object-cover rounded" />
              <div>
                <span class="text-blue-600 text-[10px] font-bold uppercase">Technology</span>
                <h3 class="font-bold leading-snug hover:text-blue-600 cursor-pointer">Implementasi Database Real-time pada Cloudflare D1.</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 border-l pl-6">
          <h2 class="font-black border-b-4 border-black inline-block mb-4">TOP STORIES</h2>
          <div class="space-y-6">
            <div v-for="n in 5" :key="n" class="flex gap-3 items-start group cursor-pointer">
              <span class="text-3xl font-black text-gray-200 group-hover:text-red-600 leading-none">{{ n }}</span>
              <p class="text-sm font-bold leading-tight group-hover:underline">Update Terbaru: Backend Hono Berhasil Terintegrasi dengan Frontend Vue.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>