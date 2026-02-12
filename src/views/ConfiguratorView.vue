<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useSizeCalculator } from '@/composables/useSizeCalculator'
import { storeToRefs } from 'pinia'
import type { MediaType, BandType, MeasurementInput } from '@/types/product'
import LegDiagram from '@/components/LegDiagram.vue'
import '@/assets/styles/configurator.css'

const props = defineProps<{ slug: string }>()

const router = useRouter()
const productsStore = useProductsStore()
const { currentProduct, currentSizeTable, currentLengths, isLoading } = storeToRefs(productsStore)

// Estado del configurador
const currentStep = ref(1)
const selectedType = ref<MediaType | null>(null)
const selectedBand = ref<BandType | null>(null)
const selectedSize = ref<string | null>(null)
const showOptional = ref(false)

const measurements = ref<MeasurementInput>({
  cB: null, cC: null, cD: null, cG: null,
  cF: null, cE: null, cB1: null, cY: null, cA: null,
  length: null
})

// Campo activo para el diagrama interactivo
const activeField = ref<string | null>(null)

// Primer campo a rellenar (para destacar en rojo)
const firstField = computed(() => {
  return selectedType.value === 'AD' ? 'cC' : 'cG'
})

// Al entrar en el paso 2, activar el primer campo
watch(currentStep, (newStep) => {
  if (newStep === 2) {
    activeField.value = firstField.value
  }
})

// Cargar producto
onMounted(() => {
  productsStore.fetchProductBySlug(props.slug)
})

// Usar composable de cálculo
const productSlug = computed(() => props.slug)
const mediaType = computed(() => selectedType.value || 'AD')

const {
  matchingSizes,
  recommendedLength,
  lengthOutOfRange,
  hasMultipleSizes,
  noSizeFound
} = useSizeCalculator(
  currentSizeTable,
  currentLengths,
  measurements,
  mediaType,
  selectedBand,
  productSlug
)

// Configuración del producto
const showBandSelector = computed(() => {
  return currentProduct.value?.hasBandSelection && selectedType.value === 'AG'
})

// Nombres e imágenes de tipos
const typeNames: Record<MediaType, { name: string; description: string; image: string }> = {
  AD: { name: 'Bajo rodilla', description: 'Media hasta debajo de la rodilla', image: '/images/type-ad.png' },
  AG: { name: 'Hasta muslo', description: 'Media hasta el muslo', image: '/images/type-ag.png' },
  AT: { name: 'Panty', description: 'Media tipo panty completo', image: '/images/type-at.png' }
}

// Navegación por breadcrumb
function goToStep(step: number) {
  currentStep.value = step
}

function selectType(type: MediaType) {
  selectedType.value = type
  selectedBand.value = null

  if (showBandSelector.value) {
    goToStep(1.5)
  } else {
    goToStep(2)
  }
}

function selectBand(band: BandType) {
  selectedBand.value = band
  goToStep(2)
}

function calculate() {
  if (hasMultipleSizes.value) {
    goToStep(2.5)
  } else if (matchingSizes.value.length === 1) {
    selectedSize.value = matchingSizes.value[0] ?? null
    goToStep(3)
  } else {
    selectedSize.value = null
    goToStep(3)
  }
}

function selectSize(size: string | undefined) {
  if (size) {
    selectedSize.value = size
    goToStep(3)
  }
}

function restart() {
  currentStep.value = 1
  selectedType.value = null
  selectedBand.value = null
  selectedSize.value = null
  showOptional.value = false
  measurements.value = {
    cB: null, cC: null, cD: null, cG: null,
    cF: null, cE: null, cB1: null, cY: null, cA: null,
    length: null
  }
}

function goBack() {
  if (currentStep.value === 3 || currentStep.value === 2.5) {
    goToStep(2)
  } else if (currentStep.value === 2) {
    if (showBandSelector.value && selectedBand.value) {
      goToStep(1.5)
    } else {
      goToStep(1)
    }
  } else if (currentStep.value === 1.5) {
    goToStep(1)
  }
}

// Breadcrumb navigation
function goToStepFromBreadcrumb(step: number) {
  if (step < currentStep.value) {
    goToStep(step)
  }
}

// Medidas requeridas según tipo
const requiredFields = computed(() => {
  if (selectedType.value === 'AD') {
    return ['cB', 'cC', 'length']
  }
  return ['cB', 'cG', 'length']
})

const canCalculate = computed(() => {
  return requiredFields.value.every(field => {
    const value = measurements.value[field as keyof MeasurementInput]
    return value !== null && value > 0
  })
})

// Step labels for mobile
const currentStepLabel = computed(() => {
  if (currentStep.value === 1) return 'Paso 1 de 3'
  if (currentStep.value === 1.5) return 'Paso 1 de 3'
  if (currentStep.value === 2) return 'Paso 2 de 3'
  if (currentStep.value === 2.5) return 'Paso 2 de 3'
  return 'Paso 3 de 3'
})
</script>

<template>
  <main class="configurator-main">
    <div class="configurator-container">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb">
        <span
          class="breadcrumb-step"
          :class="{ active: currentStep === 1 || currentStep === 1.5, completed: currentStep > 1.5 }"
          @click="goToStepFromBreadcrumb(1)"
        >
          Tipo
        </span>
        <span class="breadcrumb-separator">›</span>
        <span
          class="breadcrumb-step"
          :class="{ active: currentStep === 2 || currentStep === 2.5, completed: currentStep > 2.5 }"
          @click="goToStepFromBreadcrumb(2)"
        >
          Medidas
        </span>
        <span class="breadcrumb-separator">›</span>
        <span
          class="breadcrumb-step"
          :class="{ active: currentStep === 3 }"
        >
          Resultado
        </span>
      </nav>

      <!-- Mobile step indicator -->
      <div class="breadcrumb-mobile">{{ currentStepLabel }}</div>

      <!-- Loading -->
      <div v-if="isLoading" class="loading">
        <p>Cargando configurador...</p>
      </div>

      <!-- Step 1: Selección de tipo -->
      <div v-else-if="currentStep === 1" class="step">
        <div class="step-header">
          <h1>{{ currentProduct?.name }}</h1>
          <p>Selecciona el tipo de media</p>
        </div>

        <div class="type-options">
          <div
            v-for="type in currentProduct?.availableTypes"
            :key="type"
            class="type-card"
            :class="{ selected: selectedType === type }"
            @click="selectType(type)"
          >
            <div class="type-card-image">
              <img :src="typeNames[type].image" :alt="typeNames[type].name" />
            </div>
            <h3>{{ typeNames[type].name }}</h3>
            <p>{{ typeNames[type].description }}</p>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" @click="router.push('/')">Volver al inicio</button>
        </div>
      </div>

      <!-- Step 1.5: Selección de banda -->
      <div v-else-if="currentStep === 1.5" class="step">
        <div class="step-header">
          <h1>{{ currentProduct?.name }}</h1>
          <p>Selecciona el tipo de banda</p>
        </div>

        <div class="band-options">
          <div
            class="band-card"
            :class="{ selected: selectedBand === 'normal' }"
            @click="selectBand('normal')"
          >
            <h4>Banda Normal</h4>
            <p>Para muslos de circunferencia estándar</p>
          </div>
          <div
            class="band-card"
            :class="{ selected: selectedBand === 'ancha' }"
            @click="selectBand('ancha')"
          >
            <h4>Banda Ancha</h4>
            <p>Para muslos de mayor circunferencia</p>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" @click="goToStep(1)">Atrás</button>
        </div>
      </div>

      <!-- Step 2: Medidas -->
      <div v-else-if="currentStep === 2" class="step">
        <div class="measurements-layout">
          <!-- Columna izquierda: título, diagrama e instrucciones -->
          <div class="diagram-section">
            <div class="diagram-header">
              <h1>{{ currentProduct?.name }}</h1>
              <p>Introduce las medidas en centímetros</p>
            </div>

            <LegDiagram
              :active-point="activeField"
              :media-type="selectedType || 'AD'"
            />

            <!-- Instrucciones -->
            <div class="instructions-box">
              <div class="instructions-header">
                <span class="instructions-title">Instrucciones de medición</span>
              </div>
              <ul class="instructions-list">
                <li>Tome las medidas por la mañana cuando las piernas estén menos hinchadas</li>
                <li>Use una cinta métrica flexible y no extensible</li>
                <li>Mantenga la pierna relajada y el pie apoyado en el suelo</li>
                <li>Registre las medidas en centímetros con precisión de 0.5 cm</li>
              </ul>
            </div>
          </div>

          <!-- Formulario -->
          <div class="form-section">
            <!-- Medidas obligatorias -->
            <h3 class="form-group-title">Medidas obligatorias</h3>
            <div class="form-fields">
              <!-- AG/AT: Empezar por muslo (arriba) -->
              <div v-if="selectedType !== 'AD'" class="measurement-field" :class="{ 'is-first': activeField === 'cG' }">
                <label>Circunferencia del muslo (cG)</label>
                <div class="input-with-unit">
                  <input
                    v-model.number="measurements.cG"
                    type="number"
                    step="0.5"
                    placeholder="0"
                    @focus="activeField = 'cG'"
                    @blur="activeField = null"
                  />
                  <span class="unit">cm</span>
                </div>
              </div>

              <!-- AD: Empezar por pantorrilla (arriba para AD) -->
              <div v-if="selectedType === 'AD'" class="measurement-field" :class="{ 'is-first': activeField === 'cC' }">
                <label>Circunferencia de la pantorrilla (cC)</label>
                <div class="input-with-unit">
                  <input
                    v-model.number="measurements.cC"
                    type="number"
                    step="0.5"
                    placeholder="0"
                    @focus="activeField = 'cC'"
                    @blur="activeField = null"
                  />
                  <span class="unit">cm</span>
                </div>
              </div>

              <!-- Tobillo (siguiente hacia abajo) -->
              <div class="measurement-field">
                <label>Circunferencia del tobillo (cB)</label>
                <div class="input-with-unit">
                  <input
                    v-model.number="measurements.cB"
                    type="number"
                    step="0.5"
                    placeholder="0"
                    @focus="activeField = 'cB'"
                    @blur="activeField = null"
                  />
                  <span class="unit">cm</span>
                </div>
              </div>

              <!-- Longitud -->
              <div class="measurement-field">
                <label>
                  {{ selectedType === 'AD' ? 'Longitud del suelo a la rodilla (lD)' : 'Longitud del suelo al muslo (lG)' }}
                </label>
                <div class="input-with-unit">
                  <input
                    v-model.number="measurements.length"
                    type="number"
                    step="0.5"
                    placeholder="0"
                    @focus="activeField = 'length'"
                    @blur="activeField = null"
                  />
                  <span class="unit">cm</span>
                </div>
              </div>
            </div>

            <!-- Medidas opcionales -->
            <div class="optional-section">
              <h3 class="form-group-title">Medidas opcionales</h3>
              <div class="optional-fields">
                <div class="form-fields">
                  <!-- AG/AT: Medidas de muslo/rodilla (de arriba a abajo) -->
                  <div v-if="selectedType !== 'AD'" class="measurement-field">
                    <label>Circunferencia mitad del muslo (cF)</label>
                    <div class="input-with-unit">
                      <input
                        v-model.number="measurements.cF"
                        type="number"
                        step="0.5"
                        placeholder="0"
                        @focus="activeField = 'cF'"
                        @blur="activeField = null"
                      />
                      <span class="unit">cm</span>
                    </div>
                  </div>

                  <div v-if="selectedType !== 'AD'" class="measurement-field">
                    <label>Circunferencia encima de la rodilla (cE)</label>
                    <div class="input-with-unit">
                      <input
                        v-model.number="measurements.cE"
                        type="number"
                        step="0.5"
                        placeholder="0"
                        @focus="activeField = 'cE'"
                        @blur="activeField = null"
                      />
                      <span class="unit">cm</span>
                    </div>
                  </div>

                  <!-- AD: Debajo rodilla -->
                  <div v-if="selectedType === 'AD'" class="measurement-field">
                    <label>Circunferencia debajo de la rodilla (cD)</label>
                    <div class="input-with-unit">
                      <input
                        v-model.number="measurements.cD"
                        type="number"
                        step="0.5"
                        placeholder="0"
                        @focus="activeField = 'cD'"
                        @blur="activeField = null"
                      />
                      <span class="unit">cm</span>
                    </div>
                  </div>

                  <!-- Común: de arriba a abajo -->
                  <div class="measurement-field">
                    <label>Circunferencia encima del tobillo (cB1)</label>
                    <div class="input-with-unit">
                      <input
                        v-model.number="measurements.cB1"
                        type="number"
                        step="0.5"
                        placeholder="0"
                        @focus="activeField = 'cB1'"
                        @blur="activeField = null"
                      />
                      <span class="unit">cm</span>
                    </div>
                  </div>

                  <div class="measurement-field">
                    <label>Circunferencia del empeine (cY)</label>
                    <div class="input-with-unit">
                      <input
                        v-model.number="measurements.cY"
                        type="number"
                        step="0.5"
                        placeholder="0"
                        @focus="activeField = 'cY'"
                        @blur="activeField = null"
                      />
                      <span class="unit">cm</span>
                    </div>
                  </div>

                  <div class="measurement-field">
                    <label>Circunferencia del pie (cA)</label>
                    <div class="input-with-unit">
                      <input
                        v-model.number="measurements.cA"
                        type="number"
                        step="0.5"
                        placeholder="0"
                        @focus="activeField = 'cA'"
                        @blur="activeField = null"
                      />
                      <span class="unit">cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" @click="goBack">Atrás</button>
          <button class="btn btn-primary" :disabled="!canCalculate" @click="calculate">
            Calcular talla
          </button>
        </div>
      </div>

      <!-- Step 2.5: Selección de talla -->
      <div v-else-if="currentStep === 2.5" class="step">
        <div class="size-selection-intro">
          <h2>Hay varias tallas compatibles</h2>
          <p>Tus medidas coinciden con más de una talla. Selecciona la que mejor se adapte a tus necesidades.</p>
          <p class="compatible-sizes">Tallas compatibles: {{ matchingSizes.join(' y ') }}</p>
        </div>

        <div class="size-cards">
          <div
            class="size-card"
            @click="selectSize(matchingSizes[0])"
          >
            <div class="size-card-header">
              <span class="size-card-number">{{ matchingSizes[0] }}</span>
              <div class="size-card-label">
                <span class="fit-type">Más ajustada</span>
                <span class="fit-desc">Compresión más firme</span>
              </div>
            </div>
            <div class="size-card-reasons">
              <h4>Recomendada si</h4>
              <ul>
                <li>Las medidas se tomaron por la tarde o noche</li>
                <li>Ya has usado medias de compresión antes</li>
                <li>La compresión prescrita es CCL1 (ligera)</li>
              </ul>
            </div>
            <div class="size-card-cta">
              Seleccionar talla {{ matchingSizes[0] }}
            </div>
          </div>

          <div
            v-if="matchingSizes.length > 1"
            class="size-card"
            @click="selectSize(matchingSizes[matchingSizes.length - 1])"
          >
            <div class="size-card-header">
              <span class="size-card-number">{{ matchingSizes[matchingSizes.length - 1] }}</span>
              <div class="size-card-label">
                <span class="fit-type">Más holgada</span>
                <span class="fit-desc">Mayor comodidad</span>
              </div>
            </div>
            <div class="size-card-reasons">
              <h4>Recomendada si</h4>
              <ul>
                <li>Las medidas se tomaron por la mañana temprano</li>
                <li>Son tus primeras medias de compresión</li>
                <li>La compresión prescrita es CCL2 o superior</li>
              </ul>
            </div>
            <div class="size-card-cta">
              Seleccionar talla {{ matchingSizes[matchingSizes.length - 1] }}
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" @click="goToStep(2)">Atrás</button>
        </div>
      </div>

      <!-- Step 3: Resultado -->
      <div v-else-if="currentStep === 3" class="step">
        <div class="result-section">
          <div class="result-header">
            <h1>Tu talla recomendada</h1>
            <div class="result-size">{{ selectedSize || '—' }}</div>
            <div class="result-product">{{ currentProduct?.name }}</div>
            <div class="result-details">
              {{ selectedType ? typeNames[selectedType].name : '' }} · {{ recommendedLength }}
            </div>
          </div>

          <div v-if="noSizeFound" class="result-note error">
            <strong>Fabricación a medida necesaria</strong><br>
            Las medidas del paciente requieren una fabricación a medida.
            Por favor, haga un pedido de fabricación a medida aportando todas las medidas.
          </div>

          <div v-else-if="lengthOutOfRange" class="result-note">
            <strong>Nota:</strong> La longitud está fuera del rango estándar.
            Consulte con medi para fabricación a medida.
          </div>

          <div class="result-summary">
            <h3>Resumen de medidas</h3>
            <div class="summary-list">
              <div class="summary-item">
                <span class="label">cB (tobillo)</span>
                <span class="value">{{ measurements.cB }} cm</span>
              </div>
              <div v-if="selectedType === 'AD' && measurements.cC" class="summary-item">
                <span class="label">cC (pantorrilla)</span>
                <span class="value">{{ measurements.cC }} cm</span>
              </div>
              <div v-if="selectedType !== 'AD' && measurements.cG" class="summary-item">
                <span class="label">cG (muslo)</span>
                <span class="value">{{ measurements.cG }} cm</span>
              </div>
              <div class="summary-item">
                <span class="label">Longitud</span>
                <span class="value">{{ measurements.length }} cm</span>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button class="btn btn-secondary" @click="goToStep(2)">Modificar medidas</button>
          <button class="btn btn-primary" @click="restart">Nueva consulta</button>
        </div>
      </div>
    </div>
  </main>
</template>
