<template>
  <div class="dashboard-page">
    <header class="page-header">
      <div>
        <h1>Главная панель</h1>
        <p>Общая сводка по фермам, участкам, линиям и партиям мидий</p>
      </div>
    </header>

    <section class="stats-grid">
      <div class="stat-card" v-for="item in stats" :key="item.title">
        <p>{{ item.title }}</p>
        <h2>{{ item.value }}</h2>
      </div>
    </section>

    <section class="content-card">
      <div class="card-header">
        <h2>Последние предупреждения и рекомендации</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Ферма</th>
            <th>Приоритет</th>
            <th>Текст</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="warning in warnings" :key="warning.id">
            <td>{{ warning.date }}</td>
            <td>{{ warning.farm }}</td>
            <td>
              <span class="priority" :class="warning.type">
                {{ warning.priority }}
              </span>
            </td>
            <td>{{ warning.text }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
const stats = [
  { title: 'Количество ферм', value: '3' },
  { title: 'Количество участков', value: '8' },
  { title: 'Количество линий', value: '24' },
  { title: 'Количество партий', value: '16' },
  { title: 'Средняя смертность', value: '4.8%' },
  { title: 'Последние предупреждения', value: '2' },
  { title: 'Последние рекомендации', value: '5' }
]

const warnings = [
  {
    id: 1,
    date: '15.06.2026',
    farm: 'Ферма 1',
    priority: 'Высокий',
    type: 'high',
    text: 'Демо-предупреждение 1'
  },
  {
    id: 2,
    date: '14.06.2026',
    farm: 'Ферма 2',
    priority: 'Средний',
    type: 'medium',
    text: 'Демо-рекомендация 1'
  },
  {
    id: 3,
    date: '13.06.2026',
    farm: 'Ферма 1',
    priority: 'Низкий',
    type: 'low',
    text: 'Демо-запись 1'
  }
]
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f4f8fb;
  padding: 36px;
  color: #17324d;
}

.page-header {
  background: #ffffff;
  border-radius: 22px;
  padding: 28px 32px;
  margin-bottom: 24px;
  box-shadow: 0 12px 30px rgba(20, 44, 66, 0.07);
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

.stat-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 12px 30px rgba(20, 44, 66, 0.07);
}

.stat-card p {
  margin: 0 0 10px;
  color: #6b7c8f;
  font-size: 14px;
}

.stat-card h2 {
  margin: 0;
  font-size: 30px;
  color: #17324d;
}

.content-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 26px;
  box-shadow: 0 12px 30px rgba(20, 44, 66, 0.07);
  overflow-x: auto;
}

.card-header h2 {
  margin: 0 0 20px;
  font-size: 22px;
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

.priority {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.priority.high {
  background: #ffe8e6;
  color: #d93025;
}

.priority.medium {
  background: #fff4d8;
  color: #b7791f;
}

.priority.low {
  background: #e8f5fc;
  color: #2d9cdb;
}

@media (max-width: 1000px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 650px) {
  .dashboard-page {
    padding: 18px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
