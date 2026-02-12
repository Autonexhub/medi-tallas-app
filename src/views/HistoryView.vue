<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { dataProvider } from '@/lib/dataProvider'
import type { MeasurementSession } from '@/types/product'

const authStore = useAuthStore()
const sessions = ref<MeasurementSession[]>([])
const isLoading = ref(true)

onMounted(async () => {
  if (authStore.user) {
    sessions.value = await dataProvider.getUserSessions(authStore.user.id)
  }
  isLoading.value = false
})

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <main class="history-page">
    <header class="page-header">
      <h1>Historial de Mediciones</h1>
      <p>Tus consultas de tallas anteriores</p>
    </header>

    <div v-if="isLoading" class="loading">
      <p>Cargando historial...</p>
    </div>

    <div v-else-if="sessions.length === 0" class="empty-state">
      <p>No tienes mediciones guardadas</p>
      <router-link to="/home" class="btn-primary">Hacer una consulta</router-link>
    </div>

    <div v-else class="sessions-list">
      <article v-for="session in sessions" :key="session.id" class="session-card">
        <div class="session-header">
          <span class="session-size">{{ session.recommendedSize || '—' }}</span>
          <span class="session-date">{{ formatDate(session.createdAt) }}</span>
        </div>
        <div class="session-details">
          <span class="detail">{{ session.productSlug }}</span>
          <span class="detail">{{ session.mediaType }}</span>
          <span v-if="session.recommendedLength" class="detail">{{ session.recommendedLength }}</span>
        </div>
      </article>
    </div>
  </main>
</template>

<style scoped>
.history-page {
  min-height: 100vh;
  padding-top: 70px;
  background: var(--color-background);
}

.page-header {
  padding: 60px 40px;
  border-bottom: 1px solid var(--color-border);
  max-width: 1400px;
  margin: 0 auto;
}

.page-header h1 {
  color: var(--color-text);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.loading, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-secondary);
  max-width: 1400px;
  margin: 0 auto;
}

.empty-state .btn-primary {
  display: inline-block;
  margin-top: 24px;
  background: var(--color-primary);
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.empty-state .btn-primary:hover {
  background: var(--color-primary-dark);
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--color-border);
  border: 1px solid var(--color-border);
  max-width: 1400px;
  margin: 48px auto;
  margin-left: 40px;
  margin-right: 40px;
}

.session-card {
  background: var(--color-background);
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.session-card:hover {
  background: var(--color-background-alt);
}

.session-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.session-size {
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--color-primary);
  min-width: 80px;
}

.session-date {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.session-details {
  display: flex;
  gap: 8px;
}

.detail {
  background: var(--color-background-alt);
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 24px;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .sessions-list {
    margin: 32px 24px;
  }

  .session-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .session-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
