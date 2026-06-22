<template>
  <div class="observations-page">
    <header class="page-header">
      <div>
        <h1>Наблюдения биолога</h1>
        <p>Форма для записи и просмотра наблюдений за мидиями</p>
      </div>
    </header>

    <section class="content-card">
      <form @submit.prevent="saveObservation" class="observation-form">
        <div class="form-row">
          <div class="form-group">
            <label for="object">Объект</label>
            <select id="object" v-model="form.object" required>
              <option value="">Выберите объект</option>
              <option v-for="object in objects" :key="object.value" :value="object.value">
                {{ object.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="observation-date">Дата</label>
            <input id="observation-date" v-model="form.date" type="date" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="biofouling">Обрастание (%)</label>
            <input id="biofouling" v-model.number="form.biofouling" type="number" min="0" max="100" required />
          </div>

          <div class="form-group">
            <label for="condition">Состояние мидий</label>
            <select id="condition" v-model="form.condition" required>
              <option value="">Выберите состояние</option>
              <option value="отлично">Отлично</option>
              <option value="хорошо">Хорошо</option>
              <option value="удовлетворительно">Удовлетворительно</option>
              <option value="плохо">Плохо</option>
              <option value="критично">Критично</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="mortality">Смертность (%)</label>
            <input id="mortality" v-model.number="form.mortality" type="number" min="0" max="100" required />
          </div>

          <div class="form-group">
            <label for="density">Плотность (шт/м)</label>
            <input id="density" v-model.number="form.density" type="number" min="0" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="size">Размер (мм)</label>
            <input id="size" v-model.number="form.size" type="number" min="0" step="0.01" required />
          </div>

          <div class="form-group">
            <label for="weight">Вес (г)</label>
            <input id="weight" v-model.number="form.weight" type="number" min="0" step="0.01" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="parasites">Паразиты</label>
            <select id="parasites" v-model="form.parasites" required>
              <option value="">Выберите</option>
              <option value="yes">Да</option>
              <option value="no">Нет</option>
            </select>
          </div>

          <div class="form-group">
            <label for="parasiteType">Тип паразита</label>
            <input
              id="parasiteType"
              v-model="form.parasiteType"
              type="text"
              placeholder="Если обнаружены"
              :disabled="form.parasites === 'no'"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="comment">Комментарий</label>
          <textarea id="comment" v-model="form.comment" rows="4"></textarea>
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>
        <p v-if="successMessage" class="success-text">{{ successMessage }}</p>

        <button type="submit" class="submit-button">Сохранить</button>
      </form>
    </section>

    <section class="content-card">
      <div class="card-header">
        <h2>История наблюдений</h2>
      </div>

      <p v-if="isLoading" class="state-text">Загрузка...</p>

      <table class="observations-table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Объект</th>
            <th>Состояние</th>
            <th>Обрастание</th>
            <th>Смертность</th>
            <th>Размер</th>
            <th>Вес</th>
            <th>Паразиты</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="observation in observationRows" :key="observation.id">
            <td>{{ observation.date }}</td>
            <td class="text-cell">{{ observation.object }}</td>
            <td class="text-cell">{{ observation.condition }}</td>
            <td>{{ observation.fouling }}%</td>
            <td>{{ observation.mortality }}%</td>
            <td>{{ observation.size }} мм</td>
            <td>{{ observation.weight }} г</td>
            <td class="text-cell">{{ observation.pathogen }}</td>
            <td class="long-text-cell">{{ observation.comment || '-' }}</td>
          </tr>
          <tr v-if="!isLoading && !observationRows.length">
            <td colspan="9" class="empty-cell">Наблюдения пока не добавлены</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { apiGet, apiPost } from '../api'

const emptyForm = () => ({
  object: '',
  date: new Date().toISOString().slice(0, 10),
  biofouling: '',
  condition: '',
  mortality: '',
  density: '',
  size: '',
  weight: '',
  parasites: '',
  parasiteType: '',
  comment: ''
})

const form = ref(emptyForm())
const lines = ref([])
const batches = ref([])
const observations = ref([])
const error = ref('')
const successMessage = ref('')
const isLoading = ref(false)

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

const objects = computed(() =>
  batches.value.map((batch) => {
    const line = lines.value.find((item) => item.id === batch.line_id)

    return {
      value: `${batch.line_id}:${batch.id}`,
      label: `${line?.name || `Линия ${batch.line_id}`} / ${batch.batch_number}`
    }
  })
)

const formatDate = (date) => {
  if (!date) {
    return ''
  }

  return new Date(date).toLocaleDateString('ru-RU')
}

const getObjectLabel = (observation) => {
  const batch = batches.value.find((item) => item.id === observation.batch_id)
  const line = lines.value.find((item) => item.id === observation.line_id)

  const lineName = line?.name || `Линия ${observation.line_id}`
  const batchName = batch?.batch_number || `Партия ${observation.batch_id}`

  return `${lineName} / ${batchName}`
}

const observationRows = computed(() =>
  observations.value.map((observation) => ({
    id: observation.id,
    date: formatDate(observation.observed_at),
    object: getObjectLabel(observation),
    condition: conditionLabels[observation.mussel_condition] || observation.mussel_condition,
    fouling: observation.fouling_percent,
    mortality: observation.mortality_percent,
    size: observation.avg_size,
    weight: observation.avg_weight,
    pathogen: observation.pathogen_present ? observation.pathogen_type || 'Да' : 'Нет',
    comment: observation.comment
  }))
)

const loadData = async () => {
  try {
    isLoading.value = true
    const [loadedLines, loadedBatches, loadedObservations] = await Promise.all([
      apiGet('/lines'),
      apiGet('/batches'),
      apiGet('/observations')
    ])

    lines.value = loadedLines
    batches.value = loadedBatches
    observations.value = loadedObservations
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось загрузить наблюдения'
    lines.value = []
    batches.value = []
    observations.value = []
  } finally {
    isLoading.value = false
  }
}

const saveObservation = async () => {
  error.value = ''
  successMessage.value = ''

  const [lineId, batchId] = form.value.object.split(':').map(Number)

  try {
    await apiPost('/observations', {
      line_id: lineId,
      batch_id: batchId,
      fouling_percent: Number(form.value.biofouling),
      mussel_condition: form.value.condition,
      mortality_percent: Number(form.value.mortality),
      density: Number(form.value.density),
      avg_size: Number(form.value.size),
      avg_weight: Number(form.value.weight),
      pathogen_present: form.value.parasites === 'yes',
      pathogen_type: form.value.parasiteType || undefined,
      comment: form.value.comment || undefined,
      observed_at: form.value.date ? new Date(form.value.date).toISOString() : undefined
    })

    successMessage.value = 'Наблюдение сохранено'
    form.value = emptyForm()
    await loadData()
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось сохранить наблюдение'
  }
}

onMounted(loadData)
</script>

<style scoped>
.observations-page {
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

.page-header h1 {
  margin: 0 0 8px;
  font-size: 32px;
}

.page-header p {
  margin: 0;
  color: #6b7c8f;
  font-size: 16px;
}

.observation-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group label {
  font-size: 14px;
  color: #34495e;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  min-height: 40px;
  border: 1px solid #d7e2ea;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

.form-group textarea {
  padding: 10px 12px;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2d9cdb;
}

.form-group input:disabled {
  background: #f5f5f5;
  color: #999;
}

.submit-button {
  height: 48px;
  border: none;
  border-radius: 14px;
  background: #2d9cdb;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.submit-button:hover {
  background: #238ac3;
}

.card-header h2 {
  margin: 0 0 20px;
  font-size: 22px;
}

.state-text,
.error-text,
.success-text {
  margin: 0;
  font-size: 14px;
}

.state-text {
  margin-bottom: 16px;
  color: #6b7c8f;
}

.error-text {
  color: #d93025;
}

.success-text {
  color: #137333;
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
  white-space: nowrap;
}

td {
  padding: 14px;
  border-bottom: 1px solid #edf2f6;
  font-size: 15px;
  vertical-align: top;
}

.observations-table th:nth-child(1),
.observations-table td:nth-child(1) {
  width: 92px;
}

.observations-table th:nth-child(4),
.observations-table td:nth-child(4),
.observations-table th:nth-child(5),
.observations-table td:nth-child(5),
.observations-table th:nth-child(6),
.observations-table td:nth-child(6),
.observations-table th:nth-child(7),
.observations-table td:nth-child(7) {
  width: 92px;
}

.observations-table th:nth-child(9),
.observations-table td:nth-child(9) {
  width: 24%;
}

.text-cell,
.long-text-cell {
  line-height: 1.45;
  overflow-wrap: anywhere;
  word-break: normal;
  white-space: normal;
}

.long-text-cell {
  max-width: 280px;
}

.empty-cell {
  color: #6b7c8f;
  text-align: center;
}

@media (max-width: 900px) {
  .content-card {
    overflow-x: auto;
  }
}

@media (max-width: 650px) {
  .observations-page {
    padding: 18px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
