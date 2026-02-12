<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()
const { isAuthenticated, isAdmin, userName } = storeToRefs(authStore)

const showNav = computed(() => {
  return route.name !== 'login'
})
</script>

<template>
  <div id="app">
    <nav v-if="showNav" class="main-nav">
      <div class="nav-content">
        <RouterLink to="/home" class="nav-brand">
          <img src="/medi-logo.svg" alt="medi" class="nav-logo" />
        </RouterLink>

        <div class="nav-links">
          <RouterLink to="/home">Inicio</RouterLink>
          <RouterLink to="/productos">Productos</RouterLink>
          <RouterLink to="/historial">Historial</RouterLink>
          <RouterLink v-if="isAdmin" to="/admin">Administrar</RouterLink>
          <button class="btn-logout" @click="authStore.signOut()">Cerrar sesión</button>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --color-primary: #E10074;
  --color-primary-dark: #c4005f;
  --color-primary-light: #fef0f5;
  --color-text: #1a1a1a;
  --color-text-secondary: #666666;
  --color-border: #e0e0e0;
  --color-background: #ffffff;
  --color-background-alt: #f5f5f5;
}

body {
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--color-background);
  color: var(--color-text);
  line-height: 1.6;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  letter-spacing: -0.01em;
}

strong, b {
  font-weight: 600;
}

#app {
  min-height: 100vh;
}

.main-nav {
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.nav-brand {
  display: flex;
  text-decoration: none;
  position: absolute;
  top: 0;
  left: 40px;
}

.nav-logo {
  height: 58px;
  width: auto;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-left: auto;
}

.nav-links a {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
}

.nav-links a:hover {
  color: var(--color-text);
}

.nav-links a.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.btn-logout {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-logout:hover {
  border-color: var(--color-text);
  color: var(--color-text);
}

@media (max-width: 768px) {
  .nav-content {
    padding: 0 20px;
  }

  .nav-brand {
    left: 20px;
  }

  .nav-links {
    gap: 20px;
  }

  .nav-links a {
    font-size: 0.85rem;
  }
}
</style>
