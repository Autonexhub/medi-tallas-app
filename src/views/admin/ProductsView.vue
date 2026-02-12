<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { storeToRefs } from 'pinia'

const router = useRouter()
const productsStore = useProductsStore()
const { activeProducts, isLoading } = storeToRefs(productsStore)

onMounted(() => {
  productsStore.fetchProducts()
})
</script>

<template>
  <main class="admin-products">
    <header class="page-header">
      <div>
        <router-link to="/admin" class="back-link">← Dashboard</router-link>
        <h1>Gestión de Productos</h1>
      </div>
    </header>

    <div v-if="isLoading" class="loading">
      <p>Cargando productos...</p>
    </div>

    <div v-else class="products-table">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Tipos</th>
            <th>Banda</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in activeProducts" :key="product.id">
            <td>
              <strong>{{ product.name }}</strong>
              <br>
              <small>{{ product.description }}</small>
            </td>
            <td>
              <span v-for="type in product.availableTypes" :key="type" class="type-badge">
                {{ type }}
              </span>
            </td>
            <td>{{ product.hasBandSelection ? 'Sí' : 'No' }}</td>
            <td>
              <router-link
                :to="`/admin/productos/${product.slug}/tallas`"
                class="btn-edit"
              >
                Editar tallas
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
.admin-products {
  min-height: 100vh;
  padding-top: 70px;
  background: var(--color-background);
}

.page-header {
  padding: 60px 40px;
  border-bottom: 1px solid var(--color-border);
  max-width: 1400px;
  margin: 0 auto;
}

.back-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.back-link:hover {
  color: var(--color-primary);
}

.page-header h1 {
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 600;
  margin-top: 12px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-secondary);
}

.products-table {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--color-border);
}

th, td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th {
  background: var(--color-background-alt);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

td {
  font-size: 0.9rem;
  color: var(--color-text);
}

td strong {
  font-weight: 600;
}

td small {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.type-badge {
  display: inline-block;
  background: var(--color-background-alt);
  color: var(--color-text-secondary);
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 4px;
}

.btn-edit {
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-edit:hover {
  background: var(--color-primary-dark);
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 24px;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .products-table {
    padding: 0 24px;
  }

  table {
    min-width: 600px;
  }
}
</style>
