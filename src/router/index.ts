import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/productos',
      name: 'products',
      component: () => import('@/views/ProductListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/configurador/:slug',
      name: 'configurator',
      component: () => import('@/views/ConfiguratorView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/historial',
      name: 'history',
      component: () => import('@/views/HistoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/DashboardView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/productos',
      name: 'admin-products',
      component: () => import('@/views/admin/ProductsView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/productos/:slug/tallas',
      name: 'admin-size-table',
      component: () => import('@/views/admin/SizeTableView.vue'),
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  // Auth deshabilitado temporalmente
  next()
})

export default router
