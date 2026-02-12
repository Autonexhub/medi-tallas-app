<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { storeToRefs } from 'pinia'

const props = defineProps<{ slug: string }>()

const route = useRoute()
const productsStore = useProductsStore()
const { currentProduct, currentSizeTable, isLoading } = storeToRefs(productsStore)

const isDirty = ref(false)
const isSaving = ref(false)
const saveMessage = ref('')

onMounted(() => {
  productsStore.fetchProductBySlug(props.slug)
})

const sizeNames = computed(() => {
  return Object.keys(currentSizeTable.value || {})
})

const measurementCodes = computed(() => {
  const firstSize = currentSizeTable.value?.[sizeNames.value[0]]
  return firstSize ? Object.keys(firstSize) : []
})

function getMeasurementLabel(code: string): string {
  const labels: Record<string, string> = {
    cB: 'cB (Tobillo)',
    cC: 'cC (Pantorrilla)',
    cD: 'cD (Deb. rodilla)',
    cG: 'cG (Muslo)',
    cG_AG_normal: 'cG AG Normal',
    cG_AG_ancha: 'cG AG Ancha',
    cG_AT: 'cG Panty',
    cF: 'cF (Mit. muslo)',
    cE: 'cE (Enc. rodilla)',
    cB1: 'cB1 (Enc. tobillo)',
    cY: 'cY (Empeine)',
    cA: 'cA (Pie)'
  }
  return labels[code] || code
}

function updateValue(size: string, code: string, index: 0 | 1, event: Event) {
  const input = event.target as HTMLInputElement
  const value = parseFloat(input.value)

  if (!isNaN(value)) {
    currentSizeTable.value[size][code][index] = value
    isDirty.value = true
  }
}

async function save() {
  isSaving.value = true
  saveMessage.value = ''

  try {
    // En modo mock, los cambios se mantienen en memoria
    // En modo Supabase, aquí se llamaría al dataProvider para guardar
    await new Promise(resolve => setTimeout(resolve, 500)) // Simular delay

    isDirty.value = false
    saveMessage.value = 'Cambios guardados correctamente'

    setTimeout(() => {
      saveMessage.value = ''
    }, 3000)
  } catch (e) {
    saveMessage.value = 'Error al guardar los cambios'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <main class="size-table-editor">
    <header class="page-header">
      <div>
        <router-link to="/admin/productos" class="back-link">← Productos</router-link>
        <h1>{{ currentProduct?.name }} - Tabla de Tallas</h1>
      </div>
      <div class="actions">
        <span v-if="saveMessage" class="save-message" :class="{ error: saveMessage.includes('Error') }">
          {{ saveMessage }}
        </span>
        <button
          class="btn-save"
          :disabled="!isDirty || isSaving"
          @click="save"
        >
          {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>
    </header>

    <div v-if="isLoading" class="loading">
      <p>Cargando tabla de tallas...</p>
    </div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th class="size-col">Talla</th>
            <th v-for="code in measurementCodes" :key="code">
              {{ getMeasurementLabel(code) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="size in sizeNames" :key="size">
            <td class="size-col">
              <strong>{{ size }}</strong>
            </td>
            <td v-for="code in measurementCodes" :key="code">
              <div class="range-inputs">
                <input
                  type="number"
                  step="0.5"
                  :value="currentSizeTable[size]?.[code]?.[0]"
                  @input="updateValue(size, code, 0, $event)"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  step="0.5"
                  :value="currentSizeTable[size]?.[code]?.[1]"
                  @input="updateValue(size, code, 1, $event)"
                  placeholder="Max"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="help-text">
      <p><strong>Nota:</strong> Los valores están en centímetros. El primer valor es el mínimo y el segundo el máximo del rango.</p>
    </div>
  </main>
</template>

<style scoped>
.size-table-editor {
  min-height: 100vh;
  padding-top: 70px;
  background: var(--color-background);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 60px 40px;
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
  gap: 24px;
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
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 12px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.save-message {
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 500;
}

.save-message.error {
  color: #c53030;
}

.btn-save {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-secondary);
}

.table-container {
  padding: 48px 40px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  border: 1px solid var(--color-border);
}

th, td {
  padding: 12px 10px;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  font-size: 0.85rem;
}

th:last-child, td:last-child {
  border-right: none;
}

th {
  background: var(--color-background-alt);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.size-col {
  width: 80px;
  background: var(--color-primary-light) !important;
  color: var(--color-primary);
  font-weight: 600;
}

.range-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.range-inputs input {
  width: 55px;
  padding: 8px;
  border: 1px solid var(--color-border);
  text-align: center;
  font-size: 0.85rem;
  font-family: inherit;
  background: var(--color-background);
}

.range-inputs input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.range-inputs span {
  color: var(--color-text-secondary);
}

.help-text {
  margin: 0 40px 40px;
  padding: 16px 20px;
  background: #fef9e7;
  border: 1px solid #f4d03f;
  font-size: 0.875rem;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 24px;
  }

  .table-container {
    padding: 32px 24px;
  }

  .help-text {
    margin: 0 24px 24px;
  }
}
</style>
