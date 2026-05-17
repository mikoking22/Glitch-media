import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue' 
import DashboardView from '../views/DashboardView.vue'
import ReplyView from '../views/Replyview.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/reply/:id',    // ← tambahkan blok ini
      name: 'reply',
      component: ReplyView
    }
  ]
})

export default router