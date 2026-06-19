<template>
  <div class="location-detail-page">
    <header class="page-header">
      <div>
        <button class="back-button" @click="goBack">← Назад</button>
        <h1>{{ location.name }}</h1>
        <p>Участок фермы {{ location.farm }}</p>
      </div>
    </header>

    <section class="content-card">
      <div class="info-container">
        <div class="info-item">
          <label>Координаты</label>
          <p>{{ location.coordinates }}</p>
        </div>
        <div class="info-item">
          <label>Глубина</label>
          <p>{{ location.depth }}</p>
        </div>
      </div>
    </section>

    <section class="content-card">
      <h2>Список линий</h2>
      <table>
        <thead>
          <tr>
            <th>Название линии</th>
            <th>Длина</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="line in lines" :key="line.id">
            <td>
              <RouterLink :to="`/lines/${line.id}`" class="page-link">
                {{ line.name }}
              </RouterLink>
            </td>
            <td>{{ line.length }}</td>
            <td>{{ line.status }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const locations = {
  1: {
    id: 1,
    name: 'Участок 1',
    farm: 'Ферма 1',
    coordinates: '1.1, 1.1',
    depth: '10 м'
  },
  2: {
    id: 2,
    name: 'Участок 2',
    farm: 'Ферма 1',
    coordinates: '2.2, 2.2',
    depth: '12 м'
  },
  3: {
    id: 3,
    name: 'Участок 3',
    farm: 'Ферма 2',
    coordinates: '3.3, 3.3',
    depth: '14 м'
  },
  4: {
    id: 4,
    name: 'Участок 4',
    farm: 'Ферма 3',
    coordinates: '4.4, 4.4',
    depth: '10 м'
  },
  5: {
    id: 5,
    name: 'Участок 5',
    farm: 'Ферма 3',
    coordinates: '5.5, 5.5',
    depth: '11 м'
  }
}

const location = computed(() => locations[route.params.id] || locations[1])

const lines = [
  { id: 1, name: 'Линия 1', length: '100 м', status: 'активна' },
  { id: 2, name: 'Линия 2', length: '120 м', status: 'активна' }
]

const goBack = () => {
  if (window.history.state?.back) {
    router.back()
    return
  }

  router.push('/farms')
}
</script>

<style scoped>
.location-detail-page {
  min-height: 100vh;
  background: #f4f8fb;
  padding: 36px;
  color: #17324d;
}

.page-header,
.content-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 28px 32px;
  margin-bottom: 24px;
  box-shadow: 0 12px 30px rgba(20, 44, 66, 0.07);
}

.back-button {
  border: none;
  background: none;
  color: #2d9cdb;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
}

.back-button:hover,
.page-link:hover {
  text-decoration: underline;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 32px;
}

.page-header p {
  margin: 0;
  color: #6b7c8f;
  font-size: 16px;
}

.content-card h2 {
  margin: 0 0 20px;
  font-size: 22px;
}

.info-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item label {
  color: #6b7c8f;
  font-size: 14px;
  font-weight: 600;
}

.info-item p {
  margin: 0;
  font-size: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  color: #6b7c8f;
  font-size: 14px;
  padding: 14px;
  border-bottom: 1px solid #e1eaf0;
}

td {
  padding: 14px;
  border-bottom: 1px solid #edf2f6;
  font-size: 15px;
}

.page-link {
  color: #1f84bb;
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 650px) {
  .location-detail-page {
    padding: 18px;
  }

  .info-container {
    grid-template-columns: 1fr;
  }
}
</style>
