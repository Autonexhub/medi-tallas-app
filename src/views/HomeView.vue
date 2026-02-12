<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { storeToRefs } from 'pinia'

const router = useRouter()
const productsStore = useProductsStore()
const { activeProducts, isLoading } = storeToRefs(productsStore)

// Filtros
const searchQuery = ref('')
const selectedBrands = ref<string[]>([])
const isDropdownOpen = ref(false)

// Marcas disponibles (por ahora solo mediven)
const availableBrands = ['mediven']

// Productos filtrados
const filteredProducts = computed(() => {
  let products = activeProducts.value

  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    products = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }

  // Filtrar por marcas seleccionadas
  if (selectedBrands.value.length > 0) {
    products = products.filter(p => selectedBrands.value.includes(p.brand))
  }

  return products
})

// Contador de resultados
const resultsCount = computed(() => filteredProducts.value.length)

// Texto del botón del dropdown
const filterButtonText = computed(() => {
  if (selectedBrands.value.length === 0) {
    return 'Tipo de producto'
  }
  return `${selectedBrands.value.length} seleccionado${selectedBrands.value.length > 1 ? 's' : ''}`
})

onMounted(() => {
  productsStore.fetchProducts()
  // Cerrar dropdown al hacer click fuera
  document.addEventListener('click', handleClickOutside)
})

function handleClickOutside(e: Event) {
  const target = e.target as HTMLElement
  if (!target.closest('.filter-dropdown')) {
    isDropdownOpen.value = false
  }
}

function goToConfigurator(slug: string) {
  router.push({ name: 'configurator', params: { slug } })
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function toggleBrand(brand: string) {
  const index = selectedBrands.value.indexOf(brand)
  if (index > -1) {
    selectedBrands.value.splice(index, 1)
  } else {
    selectedBrands.value.push(brand)
  }
}

function isBrandSelected(brand: string) {
  return selectedBrands.value.includes(brand)
}

function clearFilters() {
  searchQuery.value = ''
  selectedBrands.value = []
}
</script>

<template>
  <main class="home">
    <header class="page-header">
      <h1>Guía de tallas</h1>
      <p>Selecciona un producto para encontrar la talla adecuada</p>
      <div class="header-line"></div>
    </header>

    <section class="filters-section">
      <div class="filters-container">
        <div class="filters-row">
          <!-- Barra de búsqueda (izquierda) -->
          <div class="search-bar">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar productos..."
              class="search-input"
            />
          </div>

          <!-- Contador y filtro (derecha) -->
          <div class="filters-right">
            <span class="results-count">{{ resultsCount }} {{ resultsCount === 1 ? 'producto' : 'productos' }}</span>

            <div class="filter-dropdown">
              <button class="dropdown-trigger" @click="toggleDropdown">
                <span>{{ filterButtonText }}</span>
                <span class="dropdown-arrow" :class="{ open: isDropdownOpen }"></span>
              </button>

              <div v-if="isDropdownOpen" class="dropdown-menu">
                <label
                  v-for="brand in availableBrands"
                  :key="brand"
                  class="dropdown-item"
                  :class="{ selected: isBrandSelected(brand) }"
                >
                  <input
                    type="checkbox"
                    :checked="isBrandSelected(brand)"
                    @change="toggleBrand(brand)"
                  />
                  <span class="checkbox-custom"></span>
                  <span class="brand-name">{{ brand }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Tags seleccionados (solo si hay) -->
        <div v-if="selectedBrands.length > 0 || searchQuery" class="filters-info">
          <div class="selected-tags">
            <span
              v-for="brand in selectedBrands"
              :key="brand"
              class="tag"
            >
              {{ brand }}
              <button class="tag-remove" @click="toggleBrand(brand)">×</button>
            </span>
          </div>
          <button class="clear-filters" @click="clearFilters">Limpiar</button>
        </div>
      </div>
    </section>

    <section class="products-section">
      <div v-if="isLoading" class="loading">
        <p>Cargando productos...</p>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="no-results">
        <p>No se encontraron productos</p>
        <button class="btn-clear" @click="clearFilters">Limpiar filtros</button>
      </div>

      <div v-else class="products-grid">
        <article
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          @click="goToConfigurator(product.slug)"
        >
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <div class="product-footer">
              <div class="product-types">
                <span v-for="type in product.availableTypes" :key="type" class="type-badge">
                  {{ type }}
                </span>
              </div>
              <span class="product-arrow">Ver tallas</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  min-height: 100vh;
  padding-top: 90px;
  background: var(--color-background);
}

.page-header {
  padding: 40px 40px 0;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.page-header p {
  font-size: 1rem;
  color: var(--color-text-secondary);
}

.header-line {
  width: 60px;
  height: 2px;
  background: var(--color-primary);
  margin-top: 24px;
}

/* Filtros */
.filters-section {
  /* Sin borde para un diseño más limpio */
}

.filters-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 40px;
}

.filters-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.search-bar {
  flex: 1;
  max-width: 400px;
}

.filters-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.results-count {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  font-size: 0.95rem;
  font-family: inherit;
  color: var(--color-text);
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

/* Dropdown */
.filter-dropdown {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s;
  min-width: 180px;
}

.dropdown-trigger:hover {
  border-color: var(--color-primary);
}

.dropdown-arrow {
  margin-left: auto;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--color-text-secondary);
  transition: transform 0.2s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 200px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: var(--color-background-alt);
}

.dropdown-item.selected {
  background: var(--color-primary-light);
}

.dropdown-item input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border);
  background: var(--color-background);
  position: relative;
  flex-shrink: 0;
}

.dropdown-item.selected .checkbox-custom {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.dropdown-item.selected .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.brand-name {
  font-size: 0.9rem;
  color: var(--color-text);
}

/* Filtros info (tags seleccionados) */
.filters-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.selected-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.tag-remove:hover {
  color: var(--color-primary-dark);
}

.clear-filters {
  padding: 0;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  text-decoration: underline;
}

.clear-filters:hover {
  color: var(--color-primary);
}

/* Productos */
.products-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 40px;
}

.loading {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 60px 20px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-secondary);
}

.no-results p {
  margin-bottom: 16px;
}

.btn-clear {
  padding: 10px 20px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

.product-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  border-color: var(--color-primary);
}

.product-card:hover .product-arrow {
  text-decoration: underline;
}

.product-image {
  width: 100%;
  height: 220px;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 20px;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-info h3 {
  color: var(--color-text);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.product-info p {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  flex: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.product-types {
  display: flex;
  gap: 6px;
}

.type-badge {
  background: var(--color-background-alt);
  color: var(--color-text-secondary);
  padding: 4px 8px;
  font-size: 0.7rem;
  font-weight: 500;
}

.product-arrow {
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

  .filters-container {
    padding: 20px 24px;
  }

  .filters-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-bar {
    max-width: 100%;
  }

  .dropdown-trigger {
    width: 100%;
  }

  .dropdown-menu {
    left: 0;
    right: 0;
  }

  .filters-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .products-section {
    padding: 32px 24px;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .product-image {
    height: 200px;
  }
}
</style>
