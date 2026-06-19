import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import FarmsPage from '../pages/FarmsPage.vue'
import FarmDetailPage from '../pages/FarmDetailPage.vue'
import LocationDetailPage from '../pages/LocationDetailPage.vue'
import LineDetailPage from '../pages/LineDetailPage.vue'
import BatchesPage from '../pages/BatchesPage.vue'
import BatchDetailPage from '../pages/BatchDetailPage.vue'
import ObservationsPage from '../pages/ObservationsPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/dashboard',
    component: DashboardPage
  },
  {
    path: '/farms',
    component: FarmsPage
  },
  {
    path: '/farms/:id',
    component: FarmDetailPage
  },
  {
    path: '/locations/:id',
    component: LocationDetailPage
  },
  {
    path: '/lines/:id',
    component: LineDetailPage
  },
  {
    path: '/batches',
    component: BatchesPage
  },
  {
    path: '/batches/:id',
    component: BatchDetailPage
  },
  {
    path: '/observations',
    component: ObservationsPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
