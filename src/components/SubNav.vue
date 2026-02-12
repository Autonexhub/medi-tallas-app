<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { storeToRefs } from 'pinia'

const route = useRoute()
const productsStore = useProductsStore()
const { currentProduct } = storeToRefs(productsStore)

// Generar breadcrumb según la ruta
const breadcrumbs = computed(() => {
  const path = route.path
  const crumbs: { label: string; path?: string }[] = []

  if (path === '/home' || path === '/') {
    crumbs.push({ label: 'Productos', path: '/home' })
    crumbs.push({ label: 'Guía de tallas' })
  } else if (path.includes('/configurator')) {
    crumbs.push({ label: 'Productos', path: '/home' })
    crumbs.push({ label: 'Medias de compresión', path: '/home' })
    if (currentProduct.value) {
      crumbs.push({ label: currentProduct.value.name + '®' })
    }
  } else if (path.includes('/historial')) {
    crumbs.push({ label: 'Historial' })
  } else if (path.includes('/admin')) {
    crumbs.push({ label: 'Administración' })
  }

  return crumbs
})
</script>

<template>
  <div class="breadcrumb-bar">
    <div class="breadcrumb-content">
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <router-link
          v-if="crumb.path"
          :to="crumb.path"
          class="breadcrumb-link"
        >
          {{ crumb.label }}
        </router-link>
        <span v-else class="breadcrumb-current">{{ crumb.label }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">›</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.breadcrumb-bar {
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.breadcrumb-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.breadcrumb-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--color-primary);
}

.breadcrumb-separator {
  color: var(--color-text-secondary);
}

.breadcrumb-current {
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .breadcrumb-content {
    padding: 10px 20px;
    font-size: 0.8rem;
    flex-wrap: wrap;
  }
}
</style>
