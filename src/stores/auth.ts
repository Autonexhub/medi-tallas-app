import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dataProvider } from '@/lib/dataProvider'
import type { User } from '@/types/product'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.fullName || user.value?.email || '')

  // Actions
  async function initialize() {
    isLoading.value = true
    try {
      user.value = await dataProvider.getCurrentUser()
    } catch (e) {
      console.error('Error initializing auth:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function signIn(email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      user.value = await dataProvider.signIn(email, password)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al iniciar sesión'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function signOut() {
    isLoading.value = true
    error.value = null

    try {
      await dataProvider.signOut()
      user.value = null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cerrar sesión'
      console.error('Error signing out:', e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    isAdmin,
    userName,

    // Actions
    initialize,
    signIn,
    signOut
  }
})
