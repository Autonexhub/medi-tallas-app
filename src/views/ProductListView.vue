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

function goToConfigurator(slug: string) {
  router.push({ name: 'configurator', params: { slug } })
}
</script>

<template>
  <main class="products-page">
    <header class="page-header">
      <h1>Productos Mediven</h1>
      <p>Selecciona el producto para encontrar tu talla</p>
    </header>

    <div v-if="isLoading" class="loading">
      <p>Cargando productos...</p>
    </div>

    <div v-else class="products-list">
      <article
        v-for="product in activeProducts"
        :key="product.id"
        class="product-item"
        @click="goToConfigurator(product.slug)"
      >
        <div class="product-info">
          <h2>{{ product.name }}</h2>
          <p>{{ product.description }}</p>
        </div>
        <div class="product-meta">
          <div class="types">
            <span v-for="type in product.availableTypes" :key="type" class="type-badge">
              {{ type === 'AD' ? 'Bajo rodilla' : type === 'AG' ? 'Hasta muslo' : 'Panty' }}
            </span>
          </div>
          <span class="arrow">Ver tallas</span>
        </div>
      </article>
    </div>
  </main>
</template>

<style scoped>
.products-page {
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

.page-header h1 {
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-secondary);
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--color-border);
  border: 1px solid var(--color-border);
  max-width: 1400px;
  margin: 48px auto;
  margin-left: 40px;
  margin-right: 40px;
}

.product-item {
  background: var(--color-background);
  padding: 28px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.product-item:hover {
  background: var(--color-background-alt);
}

.product-info h2 {
  color: var(--color-text);
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.product-info p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 24px;
}

.types {
  display: flex;
  gap: 8px;
}

.type-badge {
  background: var(--color-background-alt);
  color: var(--color-text-secondary);
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 500;
}

.arrow {
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 24px;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .products-list {
    margin: 32px 24px;
  }

  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .product-meta {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
