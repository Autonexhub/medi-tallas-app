import { ref } from 'vue'
import { supabase, isMockMode } from './supabase'
import type { Product, MeasurementSession, User } from '@/types/product'

// Importar datos mock
import mockProductsData from '@/data/mock/products.json'
import mockSizeTablesData from '@/data/mock/size-tables.json'

// Interfaz del DataProvider
export interface DataProvider {
  // Productos
  getProducts(): Promise<Product[]>
  getProductBySlug(slug: string): Promise<Product | null>

  // Tablas de tallas
  getSizeTable(productSlug: string): Promise<any>
  getLengths(productSlug: string): Promise<any>

  // Sesiones de medición
  saveMeasurementSession(session: Omit<MeasurementSession, 'id' | 'createdAt'>): Promise<MeasurementSession>
  getUserSessions(userId: string): Promise<MeasurementSession[]>

  // Auth
  signIn(email: string, password: string): Promise<User>
  signOut(): Promise<void>
  getCurrentUser(): Promise<User | null>
}

// ============================================
// MOCK DATA PROVIDER
// ============================================
class MockDataProvider implements DataProvider {
  private products = ref<Product[]>(mockProductsData as Product[])
  private sizeTables = mockSizeTablesData as Record<string, any>
  private sessions = ref<MeasurementSession[]>([])
  private currentUser = ref<User | null>(null)

  constructor() {
    // Cargar sesiones de localStorage
    const savedSessions = localStorage.getItem('medi_measurement_sessions')
    if (savedSessions) {
      this.sessions.value = JSON.parse(savedSessions)
    }

    // Cargar usuario de localStorage
    const savedUser = localStorage.getItem('medi_current_user')
    if (savedUser) {
      this.currentUser.value = JSON.parse(savedUser)
    }
  }

  async getProducts(): Promise<Product[]> {
    return this.products.value.filter(p => p.isActive)
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    // Productos que comparten tabla con elegance
    const eleganceFamily = ['elegance', 'comfort', 'cotton', 'plus']
    const actualSlug = eleganceFamily.includes(slug) ? 'elegance' : slug

    return this.products.value.find(p => p.slug === slug) || null
  }

  async getSizeTable(productSlug: string): Promise<any> {
    // Productos que comparten tabla con elegance
    const eleganceFamily = ['elegance', 'comfort', 'cotton', 'plus']
    const tableSlug = eleganceFamily.includes(productSlug) ? 'elegance' : productSlug

    return this.sizeTables[tableSlug]?.sizes || {}
  }

  async getLengths(productSlug: string): Promise<any> {
    const eleganceFamily = ['elegance', 'comfort', 'cotton', 'plus']
    const tableSlug = eleganceFamily.includes(productSlug) ? 'elegance' : productSlug

    return this.sizeTables[tableSlug]?.lengths || {}
  }

  async saveMeasurementSession(session: Omit<MeasurementSession, 'id' | 'createdAt'>): Promise<MeasurementSession> {
    const newSession: MeasurementSession = {
      ...session,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }

    this.sessions.value.push(newSession)
    localStorage.setItem('medi_measurement_sessions', JSON.stringify(this.sessions.value))

    return newSession
  }

  async getUserSessions(userId: string): Promise<MeasurementSession[]> {
    return this.sessions.value.filter(s => s.userId === userId)
  }

  async signIn(email: string, password: string): Promise<User> {
    // Usuarios mock predefinidos
    const mockUsers: Record<string, { password: string; user: User }> = {
      'admin@medi.es': {
        password: 'admin123',
        user: { id: 'mock-admin-001', email: 'admin@medi.es', fullName: 'Admin Medi', role: 'admin' }
      },
      'user@medi.es': {
        password: 'user123',
        user: { id: 'mock-user-001', email: 'user@medi.es', fullName: 'Usuario Demo', role: 'user' }
      }
    }

    const mockEntry = mockUsers[email]
    if (!mockEntry || mockEntry.password !== password) {
      throw new Error('Credenciales inválidas')
    }

    this.currentUser.value = mockEntry.user
    localStorage.setItem('medi_current_user', JSON.stringify(mockEntry.user))

    return mockEntry.user
  }

  async signOut(): Promise<void> {
    this.currentUser.value = null
    localStorage.removeItem('medi_current_user')
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser.value
  }
}

// ============================================
// SUPABASE DATA PROVIDER
// ============================================
class SupabaseDataProvider implements DataProvider {
  async getProducts(): Promise<Product[]> {
    if (!supabase) throw new Error('Supabase no configurado')

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (error) throw error

    return data.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      availableTypes: p.available_types,
      hasBandSelection: p.has_band_selection,
      isActive: p.is_active,
      displayOrder: p.display_order
    }))
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (!supabase) throw new Error('Supabase no configurado')

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) return null

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description,
      availableTypes: data.available_types,
      hasBandSelection: data.has_band_selection,
      isActive: data.is_active,
      displayOrder: data.display_order
    }
  }

  async getSizeTable(productSlug: string): Promise<any> {
    if (!supabase) throw new Error('Supabase no configurado')

    // Primero obtener el producto
    const product = await this.getProductBySlug(productSlug)
    if (!product) return {}

    // Obtener tablas de tallas con medidas
    const { data, error } = await supabase
      .from('size_tables')
      .select(`
        *,
        size_measurements (*)
      `)
      .eq('product_id', product.id)
      .order('display_order')

    if (error) throw error

    // Transformar a formato esperado
    const sizes: Record<string, any> = {}
    for (const sizeTable of data) {
      sizes[sizeTable.size_name] = {}
      for (const m of sizeTable.size_measurements) {
        sizes[sizeTable.size_name][m.measurement_code] = [m.min_value, m.max_value]
      }
    }

    return sizes
  }

  async getLengths(productSlug: string): Promise<any> {
    if (!supabase) throw new Error('Supabase no configurado')

    const product = await this.getProductBySlug(productSlug)
    if (!product) return {}

    const { data, error } = await supabase
      .from('product_lengths')
      .select('*')
      .eq('product_id', product.id)

    if (error) throw error

    const lengths: Record<string, Record<string, number[]>> = {}
    for (const l of data) {
      if (!lengths[l.media_type]) {
        lengths[l.media_type] = {}
      }
      lengths[l.media_type][l.length_name] = [l.min_value, l.max_value]
    }

    return lengths
  }

  async saveMeasurementSession(session: Omit<MeasurementSession, 'id' | 'createdAt'>): Promise<MeasurementSession> {
    if (!supabase) throw new Error('Supabase no configurado')

    const { data, error } = await supabase
      .from('measurement_sessions')
      .insert({
        user_id: session.userId,
        product_id: session.productId,
        media_type: session.mediaType,
        band_type: session.bandType,
        recommended_size: session.recommendedSize,
        recommended_length: session.recommendedLength,
        matching_sizes: session.matchingSizes
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      userId: data.user_id,
      productId: data.product_id,
      productSlug: session.productSlug,
      mediaType: data.media_type,
      bandType: data.band_type,
      measurements: session.measurements,
      recommendedSize: data.recommended_size,
      recommendedLength: data.recommended_length,
      matchingSizes: data.matching_sizes,
      createdAt: new Date(data.created_at)
    }
  }

  async getUserSessions(userId: string): Promise<MeasurementSession[]> {
    if (!supabase) throw new Error('Supabase no configurado')

    const { data, error } = await supabase
      .from('measurement_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(s => ({
      id: s.id,
      userId: s.user_id,
      productId: s.product_id,
      productSlug: '',
      mediaType: s.media_type,
      bandType: s.band_type,
      measurements: {} as any,
      recommendedSize: s.recommended_size,
      recommendedLength: s.recommended_length,
      matchingSizes: s.matching_sizes,
      createdAt: new Date(s.created_at)
    }))
  }

  async signIn(email: string, password: string): Promise<User> {
    if (!supabase) throw new Error('Supabase no configurado')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    // Obtener perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return {
      id: data.user.id,
      email: data.user.email!,
      fullName: profile?.full_name,
      role: profile?.role || 'user'
    }
  }

  async signOut(): Promise<void> {
    if (!supabase) throw new Error('Supabase no configurado')
    await supabase.auth.signOut()
  }

  async getCurrentUser(): Promise<User | null> {
    if (!supabase) return null

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      id: user.id,
      email: user.email!,
      fullName: profile?.full_name,
      role: profile?.role || 'user'
    }
  }
}

// ============================================
// EXPORTAR PROVIDER SEGÚN MODO
// ============================================
export const dataProvider: DataProvider = isMockMode
  ? new MockDataProvider()
  : new SupabaseDataProvider()
