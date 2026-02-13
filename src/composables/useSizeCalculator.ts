import { computed, ref, type Ref } from 'vue'
import type { MediaType, BandType, MeasurementInput, CalculationResult, SizeRange } from '@/types/product'

interface SizeTableEntry {
  [measurementCode: string]: [number, number] | undefined
}

interface SizeTable {
  [sizeName: string]: SizeTableEntry
}

interface LengthTable {
  [mediaType: string]: {
    [lengthName: string]: [number, number]
  }
}

/**
 * Composable para calcular tallas de medias de compresión
 */
export function useSizeCalculator(
  sizeTable: Ref<SizeTable>,
  lengthTable: Ref<LengthTable>,
  measurements: Ref<MeasurementInput>,
  mediaType: Ref<MediaType>,
  bandType: Ref<BandType | null>,
  productSlug: Ref<string>
) {
  /**
   * Verifica si una medida está dentro del rango
   */
  const checkMeasurement = (value: number | null, range: [number, number] | null | undefined): boolean => {
    if (!value || !range) return true // Si no hay valor o rango, se considera válido
    return value >= range[0] && value <= range[1]
  }

  /**
   * Obtiene el código de medida correcto según el tipo de media y banda
   */
  const getMeasurementCode = (baseCode: string): string => {
    if (baseCode !== 'cG') return baseCode

    const slug = productSlug.value
    const type = mediaType.value
    const band = bandType.value

    // Productos con variantes de banda (elegance, comfort, cotton, plus, forte)
    const productsWithBand = ['elegance', 'comfort', 'cotton', 'plus', 'forte']

    if (productsWithBand.includes(slug)) {
      if (type === 'AT') return 'cG_AT'
      if (type === 'AG' && band === 'ancha') return 'cG_AG_ancha'
      if (type === 'AG') return 'cG_AG_normal'
    }

    // Productos sin variantes (sheer-soft, mondi, etc.)
    return 'cG'
  }

  /**
   * Calcula las tallas que coinciden con las medidas
   */
  const matchingSizes = computed<string[]>(() => {
    const table = sizeTable.value
    if (!table || Object.keys(table).length === 0) return []

    const m = measurements.value
    const type = mediaType.value

    const matches: string[] = []

    for (const [sizeName, ranges] of Object.entries(table)) {
      let isMatch = true

      // cB (tobillo) - siempre requerido
      if (m.cB !== null && ranges.cB) {
        if (!checkMeasurement(m.cB, ranges.cB)) {
          isMatch = false
        }
      }

      // Medidas específicas según tipo de media
      if (type === 'AD') {
        // Para AD: verificar cC (pantorrilla) y cD (debajo rodilla)
        if (m.cC !== null && ranges.cC) {
          if (!checkMeasurement(m.cC, ranges.cC)) isMatch = false
        }
        if (m.cD !== null && ranges.cD) {
          if (!checkMeasurement(m.cD, ranges.cD)) isMatch = false
        }
      } else {
        // Para AG/AT: verificar cG (muslo) con el código correcto
        const cGCode = getMeasurementCode('cG')
        if (m.cG !== null && ranges[cGCode]) {
          if (!checkMeasurement(m.cG, ranges[cGCode])) isMatch = false
        }
      }

      // Medidas opcionales
      const optionalFields: (keyof MeasurementInput)[] = ['cF', 'cE', 'cB1', 'cY', 'cA']
      for (const field of optionalFields) {
        const value = m[field]
        const range = ranges[field]
        if (value !== null && range) {
          if (!checkMeasurement(value, range)) {
            isMatch = false
            break
          }
        }
      }

      if (isMatch) {
        matches.push(sizeName)
      }
    }

    return matches
  })

  /**
   * Calcula la longitud recomendada
   */
  const recommendedLength = computed<string | null>(() => {
    const lengths = lengthTable.value
    const type = mediaType.value
    const lengthValue = measurements.value.length

    if (!lengths || !lengths[type] || lengthValue === null) return null

    for (const [lengthName, range] of Object.entries(lengths[type])) {
      if (lengthValue >= range[0] && lengthValue <= range[1]) {
        return lengthName
      }
    }

    // Si está fuera de rango, devolver el más cercano
    const lengthNames = Object.keys(lengths[type])
    const ranges = Object.values(lengths[type])

    if (ranges.length === 0 || !ranges[0]) return null

    if (lengthValue < ranges[0][0]) {
      return lengthNames[0] || null // Corta
    }
    return lengthNames[lengthNames.length - 1] || null // Regular/Normal
  })

  /**
   * Verifica si la longitud está fuera de rango
   */
  const lengthOutOfRange = computed<boolean>(() => {
    const lengths = lengthTable.value
    const type = mediaType.value
    const lengthValue = measurements.value.length

    if (!lengths || !lengths[type] || lengthValue === null) return false

    for (const range of Object.values(lengths[type])) {
      if (lengthValue >= range[0] && lengthValue <= range[1]) {
        return false
      }
    }

    return true
  })

  /**
   * Resultado completo del cálculo
   */
  const calculationResult = computed<CalculationResult>(() => ({
    matchingSizes: matchingSizes.value,
    recommendedLength: recommendedLength.value,
    lengthOutOfRange: lengthOutOfRange.value,
    needsCustomFit: matchingSizes.value.length === 0
  }))

  /**
   * Indica si hay múltiples tallas compatibles
   */
  const hasMultipleSizes = computed(() => matchingSizes.value.length > 1)

  /**
   * Indica si no se encontró ninguna talla
   */
  const noSizeFound = computed(() => matchingSizes.value.length === 0)

  return {
    matchingSizes,
    recommendedLength,
    lengthOutOfRange,
    calculationResult,
    hasMultipleSizes,
    noSizeFound,
    checkMeasurement
  }
}
