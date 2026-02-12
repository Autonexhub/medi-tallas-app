<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const productsStore = useProductsStore()
const authStore = useAuthStore()
const { activeProducts } = storeToRefs(productsStore)

onMounted(() => {
  productsStore.fetchProducts()
})
</script>

<template>
  <main class="admin-dashboard">
    <header class="admin-header">
      <div>
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {{ authStore.userName }}</p>
      </div>
      <button class="btn-logout" @click="authStore.signOut(); router.push('/')">
        Cerrar sesión
      </button>
    </header>

    <nav class="admin-nav">
      <router-link to="/admin/productos" class="nav-card">
        <h3>Productos</h3>
        <p>{{ activeProducts.length }} productos activos</p>
      </router-link>
    </nav>

    <section class="quick-actions">
      <h2>Acceso rápido - Tablas de tallas</h2>
      <div class="products-grid">
        <router-link
          v-for="product in activeProducts"
          :key="product.id"
          :to="`/admin/productos/${product.slug}/tallas`"
          class="product-link"
        >
          {{ product.name }}
        </router-link>
      </div>
    </section>
  </main>
</template>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  padding-top: 70px;
  background: var(--color-background);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 40px;
  border-bottom: 1px solid var(--color-border);
  max-width: 1400px;
  margin: 0 auto;
}

.admin-header h1 {
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.admin-header p {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.btn-logout {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
  font-family: inherit;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-logout:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

.admin-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1px;
  background: var(--color-border);
  border: 1px solid var(--color-border);
  max-width: 1400px;
  margin: 48px auto 0;
  padding: 0 40px;
}

.nav-card {
  background: var(--color-background);
  padding: 32px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.nav-card:hover {
  background: var(--color-background-alt);
}

.nav-card h3 {
  color: var(--color-text);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.nav-card p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.quick-actions {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 40px;
}

.quick-actions h2 {
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 24px;
}

.products-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.product-link {
  background: var(--color-background-alt);
  color: var(--color-text-secondary);
  padding: 10px 16px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.product-link:hover {
  background: var(--color-primary);
  color: white;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding: 40px 24px;
  }

  .admin-nav,
  .quick-actions {
    padding: 32px 24px;
  }

  .admin-header h1 {
    font-size: 1.5rem;
  }
}
</style>
