// Tipos para productos y tablas de tallas

export type MediaType = 'AD' | 'AG' | 'AT'
export type BandType = 'normal' | 'ancha'
export type UserRole = 'user' | 'admin'

export interface Product {
  id: string
  slug: string
  name: string
  description?: string
  brand: string
  image?: string
  availableTypes: MediaType[]
  hasBandSelection: boolean
  isActive: boolean
  displayOrder: number
}

export interface ProductLength {
  id: string
  productId: string
  mediaType: MediaType
  lengthName: string // 'Corta', 'Regular', 'Normal'
  minValue: number
  maxValue: number
}

export interface SizeRange {
  min: number
  max: number
}

export interface SizeMeasurements {
  // Medidas básicas (siempre presentes)
  cB: SizeRange    // Tobillo
  cC?: SizeRange   // Pantorrilla
  cD?: SizeRange   // Debajo rodilla

  // Medidas para AG/AT
  cG?: SizeRange           // Muslo (simple)
  cG_AG_normal?: SizeRange // Muslo banda normal
  cG_AG_ancha?: SizeRange  // Muslo banda ancha
  cG_AT?: SizeRange        // Muslo panty

  // Medidas adicionales
  cF?: SizeRange   // Mitad muslo
  cE?: SizeRange   // Encima rodilla
  cB1?: SizeRange  // Encima tobillo
  cY?: SizeRange   // Empeine
  cA?: SizeRange   // Pie

  // Index signature para acceso dinámico
  [key: string]: SizeRange | undefined
}

export interface SizeTable {
  id: string
  productId: string
  sizeName: string  // 'I', 'II', ..., 'XIV'
  displayOrder: number
  measurements: SizeMeasurements
}

export interface ProductConfig {
  product: Product
  lengths: ProductLength[]
  sizeTable: SizeTable[]
}

// Tipos para el formulario de mediciones
export interface MeasurementInput {
  cB: number | null
  cC: number | null
  cD: number | null
  cG: number | null
  cF: number | null
  cE: number | null
  cB1: number | null
  cY: number | null
  cA: number | null
  length: number | null
}

// Resultado del cálculo
export interface CalculationResult {
  matchingSizes: string[]
  recommendedLength: string | null
  lengthOutOfRange: boolean
  needsCustomFit: boolean
}

// Sesión de medición (historial)
export interface MeasurementSession {
  id: string
  userId?: string
  productId: string
  productSlug: string
  mediaType: MediaType
  bandType?: BandType
  measurements: MeasurementInput
  recommendedSize: string | null
  recommendedLength: string | null
  matchingSizes: string[]
  createdAt: Date
}

// Usuario
export interface User {
  id: string
  email: string
  fullName?: string
  role: UserRole
}
