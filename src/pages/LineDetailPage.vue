<template>
  <div class="line-detail-page">
    <header class="page-header">
      <div>
        <button class="back-button" @click="goBack">← Назад</button>
        <h1>{{ line.name }}</h1>
        <p>Канат мониторинга на участке {{ line.location }}</p>
      </div>
    </header>

    <section class="tabs-section">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'sensors'" class="tab-pane">
          <table>
            <thead>
              <tr>
                <th>Название датчика</th>
                <th>Тип</th>
                <th>Значение</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sensor in sensors" :key="sensor.id">
                <td>{{ sensor.name }}</td>
                <td>{{ sensor.type }}</td>
                <td>{{ sensor.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'history'" class="tab-pane">
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Событие</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in history" :key="event.id">
                <td>{{ event.date }}</td>
                <td>{{ event.event }}</td>
                <td>{{ event.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'batches'" class="tab-pane">
          <table>
            <thead>
              <tr>
                <th>Номер партии</th>
                <th>Дата добавления</th>
                <th>Количество</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="batch in batches" :key="batch.id">
                <td>
                  <RouterLink :to="`/batches/${batch.id}`" class="page-link">
                    {{ batch.number }}
                  </RouterLink>
                </td>
                <td>{{ batch.dateAdded }}</td>
                <td>{{ batch.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('sensors')

const tabs = [
  { id: 'sensors', label: 'Текущие датчики' },
  { id: 'history', label: 'История' },
  { id: 'batches', label: 'Партии мидий' }
]

const line = {
  id: 1,
  name: 'Линия 1',
  location: 'Участок 1'
}

const sensors = [
  { id: 1, name: 'Датчик 1', type: 'Тип 1', value: '10' },
  { id: 2, name: 'Датчик 2', type: 'Тип 2', value: '20' }
]

const history = [
  { id: 1, date: '15.06.2026', event: 'Событие 1', description: 'Описание 1' },
  { id: 2, date: '08.06.2026', event: 'Событие 2', description: 'Описание 2' }
]

const batches = [
  { id: 1, number: 'Партия 1', dateAdded: '01.06.2026', quantity: '1000 шт.' },
  { id: 2, number: 'Партия 2', dateAdded: '10.06.2026', quantity: '2000 шт.' }
]

const goBack = () => {
  router.push('/locations/1')
}
</script>

<style scoped>
.line-detail-page {
  min-height: 100vh;
  background: #f4f8fb;
  padding: 36px;
  color: #17324d;
}

.page-header,
.tabs-section {
  background: #ffffff;
  border-radius: 22px;
  box-shadow: 0 12px 30px rgba(20, 44, 66, 0.07);
}

.page-header {
  padding: 28px 32px;
  margin-bottom: 24px;
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

.tabs-section {
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e1eaf0;
}

.tab {
  flex: 1;
  border: none;
  background: none;
  color: #6b7c8f;
  padding: 18px;
  font-size: 15px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
}

.tab.active {
  color: #2d9cdb;
  border-bottom-color: #2d9cdb;
}

.tab-content {
  padding: 26px;
  overflow-x: auto;
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
  .line-detail-page {
    padding: 18px;
  }

  .tabs {
    flex-wrap: wrap;
  }
}
</style>
