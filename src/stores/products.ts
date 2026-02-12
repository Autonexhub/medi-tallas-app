import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dataProvider } from '@/lib/dataProvider'
import type { Product } from '@/types/product'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const currentSizeTable = ref<any>({})
  const currentLengths = ref<any>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeProducts = computed(() => products.value.filter(p => p.isActive))

  const getProductBySlug = computed(() => {
    return (slug: string) => products.value.find(p => p.slug === slug)
  })

  // Actions
  async function fetchProducts() {
    isLoading.value = true
    error.value = null

    try {
      products.value = await dataProvider.getProducts()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar productos'
      console.error('Error fetching products:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProductBySlug(slug: string) {
    isLoading.value = true
    error.value = null

    try {
      currentProduct.value = await dataProvider.getProductBySlug(slug)

      if (currentProduct.value) {
        // Cargar tabla de tallas y longitudes
        const [sizeTable, lengths] = await Promise.all([
          dataProvider.getSizeTable(slug),
          dataProvider.getLengths(slug)
        ])

        currentSizeTable.value = sizeTable
        currentLengths.value = lengths
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar producto'
      console.error('Error fetching product:', e)
    } finally {
      isLoading.value = false
    }
  }

  function clearCurrentProduct() {
    currentProduct.value = null
    currentSizeTable.value = {}
    currentLengths.value = {}
  }

  return {
    // State
    products,
    currentProduct,
    currentSizeTable,
    currentLengths,
    isLoading,
    error,

    // Getters
    activeProducts,
    getProductBySlug,

    // Actions
    fetchProducts,
    fetchProductBySlug,
    clearCurrentProduct
  }
})
