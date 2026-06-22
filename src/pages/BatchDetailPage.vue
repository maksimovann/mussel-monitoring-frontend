<template>
  <div class="batch-detail-page">
    <header class="page-header">
      <div>
        <button class="back-button" @click="goBack">← Назад</button>
        <h1>{{ batch.number || 'Партия мидий' }}</h1>
        <p>Партия мидий на {{ batch.line || 'линии' }}</p>
      </div>
    </header>

    <section class="content-card">
      <p v-if="isLoading" class="state-text">Загрузка...</p>
      <p v-if="error" class="error-text">{{ error }}</p>
      <div class="info-container">
        <div class="info-item">
          <label>Возраст</label>
          <p>{{ batch.age }}</p>
        </div>
        <div class="info-item">
          <label>Средняя масса</label>
          <p>{{ batch.weight }}</p>
        </div>
        <div class="info-item">
          <label>Средний размер</label>
          <p>{{ batch.size }}</p>
        </div>
        <div class="info-item">
          <label>Смертность</label>
          <p>{{ batch.mortality }}</p>
        </div>
      </div>
    </section>

    <section class="content-card">
      <div class="card-header">
        <h2>Бионаблюдения по партии</h2>
      </div>

      <table class="history-table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Состояние</th>
            <th>Масса</th>
            <th>Размер</th>
            <th>Смертность</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="observation in observationRows" :key="observation.id">
            <td>{{ observation.date }}</td>
            <td>{{ observation.condition }}</td>
            <td>{{ observation.weight }}</td>
            <td>{{ observation.size }}</td>
            <td>{{ observation.mortality }}</td>
            <td class="long-text-cell">{{ observation.comment }}</td>
          </tr>
          <tr v-if="!isLoading && !observationRows.length">
            <td colspan="6" class="empty-cell">Наблюдения по партии пока не добавлены</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiGet } from '../api'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const error = ref('')
const observations = ref([])

const batch = ref({
  id: Number(route.params.id || 1),
  number: '',
  line: '',
  age: '',
  weight: '',
  size: '',
  mortality: ''
})

const conditionLabels = {
  excellent: 'Отлично',
  good: 'Хорошо',
  satisfactory: 'Удовлетворительно',
  poor: 'Плохо',
  critical: 'Критично',
  'отлично': 'Отлично',
  'хорошо': 'Хорошо',
  'удовлетворительно': 'Удовлетворительно',
  'плохо': 'Плохо',
  'критично': 'Критично',
  'Идеальное': 'Идеальное'
}

const calculateAge = (date) => {
  if (!date) {
    return 'не указано'
  }

  const seedDate = new Date(date)
  const diff = Date.now() - seedDate.getTime()
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  return `${days} дней`
}

const formatDate = (date) => {
  if (!date) {
    return ''
  }

  return new Date(date).toLocaleDateString('ru-RU')
}

const formatMetric = (value, unit) => {
  if (value === null || value === undefined || value === '') {
    return 'нет данных'
  }

  return `${value} ${unit}`
}

const sortedObservations = computed(() =>
  [...observations.value].sort((a, b) => new Date(b.observed_at) - new Date(a.observed_at))
)

const observationRows = computed(() =>
  sortedObservations.value.map((observation) => ({
    id: observation.id,
    date: formatDate(observation.observed_at),
    condition: conditionLabels[observation.mussel_condition] || observation.mussel_condition,
    weight: formatMetric(observation.avg_weight, 'г'),
    size: formatMetric(observation.avg_size, 'мм'),
    mortality: formatMetric(observation.mortality_percent, '%'),
    comment: observation.comment || '-'
  }))
)

const updateBatchMetrics = (loadedBatch, line, latestObservation) => {
  batch.value = {
    id: loadedBatch.id,
    number: loadedBatch.batch_number,
    line: line.name || `Линия ${loadedBatch.line_id}`,
    age: calculateAge(loadedBatch.seed_date),
    weight: formatMetric(latestObservation?.avg_weight, 'г'),
    size: formatMetric(latestObservation?.avg_size, 'мм'),
    mortality: formatMetric(latestObservation?.mortality_percent, '%')
  }
}

const loadBatch = async () => {
  try {
    isLoading.value = true
    error.value = ''
    const batchId = Number(route.params.id)
    const loadedBatch = await apiGet(`/batches/${batchId}`)

    const [line, loadedObservations] = await Promise.all([
      apiGet(`/lines/${loadedBatch.line_id}`),
      apiGet('/observations')
    ])

    observations.value = loadedObservations.filter((item) => item.batch_id === batchId)
    updateBatchMetrics(loadedBatch, line, sortedObservations.value[0])
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось загрузить партию'
    batch.value = {
      id: Number(route.params.id || 1),
      number: '',
      line: '',
      age: '',
      weight: '',
      size: '',
      mortality: ''
    }
    observations.value = []
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/batches')
}

onMounted(loadBatch)
</script>

<style scoped>
.batch-detail-page {
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

.back-button:hover {
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

.state-text,
.error-text {
  margin: 0 0 16px;
  font-size: 14px;
}

.state-text {
  color: #6b7c8f;
}

.error-text {
  color: #d93025;
}

.info-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
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
  color: #17324d;
  line-height: 1.5;
}

.card-header h2 {
  margin: 0 0 20px;
  font-size: 22px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
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
  vertical-align: top;
}

.history-table th:nth-child(1),
.history-table td:nth-child(1) {
  width: 110px;
}

.history-table th:nth-child(6),
.history-table td:nth-child(6) {
  width: 28%;
}

.long-text-cell {
  line-height: 1.45;
  overflow-wrap: anywhere;
  white-space: normal;
}

.empty-cell {
  color: #6b7c8f;
  text-align: center;
}

@media (max-width: 1000px) {
  .info-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 650px) {
  .batch-detail-page {
    padding: 18px;
  }

  .info-container {
    grid-template-columns: 1fr;
  }
}
</style>
