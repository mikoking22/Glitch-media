import { createRouter, createWebHistory } from 'vue-router'
// Pastikan nama file di bawah ini sesuai dengan yang ada di folder views
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue' 
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register', // Alamat yang dicari browser
      name: 'register',
      component: RegisterView // Komponen yang akan ditampilkan
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    }
  ]
})

export default router