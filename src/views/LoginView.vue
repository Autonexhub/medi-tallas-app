<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function enterApp() {
  router.push('/home')
}
</script>

<template>
  <main class="login-page">
    <div class="login-image">
      <img
        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80"
        alt="medi"
      />
      <div class="image-overlay">
        <img src="/medi-logo.svg" alt="medi" class="brand-logo" />
        <p>Guía de tallas para productos de compresión médica</p>
      </div>
    </div>

    <div class="login-form-container">
      <div class="login-form-wrapper">
        <header class="login-header">
          <h1>Bienvenido</h1>
          <p>Accede a la guía de tallas de medi</p>
        </header>

        <button @click="enterApp" class="btn-submit">
          Entrar
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
}

.login-image {
  flex: 1;
  position: relative;
  display: none;
}

@media (min-width: 1024px) {
  .login-image {
    display: block;
  }
}

.login-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(225, 0, 116, 0.9) 0%, rgba(196, 0, 95, 0.95) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px;
  color: white;
  text-align: center;
}

.brand-logo {
  width: 180px;
  height: auto;
  margin-bottom: 24px;
}

.image-overlay p {
  font-size: 1.25rem;
  font-weight: 400;
  opacity: 0.9;
  max-width: 400px;
  line-height: 1.5;
}

.login-form-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: var(--color-background);
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-header {
  margin-bottom: 48px;
}

.login-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.login-header p {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.btn-submit {
  width: 100%;
  padding: 14px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background: var(--color-primary-dark);
}

@media (max-width: 480px) {
  .login-form-container {
    padding: 24px;
  }

  .login-header {
    margin-bottom: 32px;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
