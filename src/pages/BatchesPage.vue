<template>
  <div class="batches-page">
    <header class="page-header">
      <div>
        <h1>Партии мидий</h1>
        <p>Список всех партий мидий на фермах</p>
      </div>

      <button class="primary-button" @click="openAddModal">Добавить партию</button>
    </header>

    <section class="content-card">
      <p v-if="isLoading" class="state-text">Загрузка...</p>
      <p v-if="error" class="error-text">{{ error }}</p>

      <table>
        <thead>
          <tr>
            <th>Номер</th>
            <th>Линия</th>
            <th>Дата посадки</th>
            <th>Статус</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="batch in batches" :key="batch.id">
            <td>
              <RouterLink :to="`/batches/${batch.id}`" class="page-link">
                {{ batch.number }}
              </RouterLink>
            </td>
            <td>{{ batch.line }}</td>
            <td>{{ batch.dateAdded }}</td>
            <td>
              <span class="status" :class="batch.status">
                {{ batch.statusLabel }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
      <form class="batch-modal" @submit.prevent="saveBatch">
        <div class="modal-header">
          <h2>Добавить партию</h2>
          <button class="close-button" type="button" @click="closeModal">×</button>
        </div>

        <div class="form-group">
          <label for="batch-number">Номер</label>
          <input id="batch-number" v-model="form.number" type="text" required />
        </div>

        <div class="form-group">
          <label for="batch-line">Линия</label>
          <select id="batch-line" v-model="form.line" required>
            <option value="">Выберите линию</option>
            <option v-for="line in lines" :key="line.id" :value="line.name">
              {{ line.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="batch-date">Дата посадки</label>
          <input id="batch-date" v-model="form.dateAdded" type="date" required />
        </div>

        <div class="form-group">
          <label for="batch-count">Начальное количество</label>
          <input id="batch-count" v-model.number="form.initialCount" type="number" min="0" required />
        </div>

        <div class="form-group">
          <label for="batch-status">Статус</label>
          <select id="batch-status" v-model="form.status" required>
            <option value="active">Активна</option>
            <option value="completed">Завершена</option>
            <option value="lost">Утрачена</option>
            <option value="archived">Архивная</option>
          </select>
        </div>

        <div class="modal-actions">
          <button class="secondary-button" type="button" @click="closeModal">Отмена</button>
          <button class="primary-button" type="submit">Сохранить</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { apiGet, apiPost } from '../api'

const demoBatches = [
  {
    id: 1,
    number: 'Партия 1',
    line: 'Линия 1',
    dateAdded: '01.06.2026',
    initialCount: 1000,
    status: 'active',
    statusLabel: 'Активна'
  },
  {
    id: 2,
    number: 'Партия 2',
    line: 'Линия 2',
    dateAdded: '10.06.2026',
    initialCount: 2000,
    status: 'active',
    statusLabel: 'Активна'
  },
  {
    id: 3,
    number: 'Партия 3',
    line: 'Линия 1',
    dateAdded: '18.05.2026',
    initialCount: 1500,
    status: 'completed',
    statusLabel: 'Завершена'
  }
]

const demoLines = [
  { id: 1, name: 'Линия 1' },
  { id: 2, name: 'Линия 2' },
  { id: 3, name: 'Линия 3' }
]

const batches = ref(demoBatches)
const lines = ref(demoLines)
const isLoading = ref(false)
const error = ref('')

const isModalOpen = ref(false)

const form = reactive({
  number: '',
  line: '',
  dateAdded: '',
  initialCount: '',
  status: 'active'
})

const openAddModal = () => {
  form.number = ''
  form.line = ''
  form.dateAdded = ''
  form.initialCount = ''
  form.status = 'active'
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const formatDate = (date) => {
  if (!date) {
    return ''
  }

  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}`
}

const formatBackendDate = (date) => {
  if (!date) {
    return ''
  }

  return new Date(date).toLocaleDateString('ru-RU')
}

const statusLabels = {
  active: 'Активна',
  completed: 'Завершена',
  lost: 'Утрачена',
  archived: 'Архивная'
}

const mapBatch = (batch) => {
  const line = lines.value.find((item) => item.id === batch.line_id)

  return {
    id: batch.id,
    number: batch.batch_number,
    line: line?.name || `Линия ${batch.line_id}`,
    dateAdded: formatBackendDate(batch.seed_date),
    initialCount: batch.initial_count,
    status: batch.status,
    statusLabel: statusLabels[batch.status] || batch.status
  }
}

const loadData = async () => {
  try {
    isLoading.value = true
    error.value = ''
    const [loadedLines, loadedBatches] = await Promise.all([
      apiGet('/lines'),
      apiGet('/batches')
    ])

    lines.value = loadedLines.length ? loadedLines : demoLines
    batches.value = loadedBatches.map(mapBatch)
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось загрузить партии'
    lines.value = demoLines
    batches.value = demoBatches
  } finally {
    isLoading.value = false
  }
}

const saveBatch = async () => {
  const selectedLine = lines.value.find((line) => line.name === form.line)

  if (!selectedLine) {
    error.value = 'Выберите линию'
    return
  }

  try {
    const createdBatch = await apiPost('/batches', {
      line_id: selectedLine.id,
      batch_number: form.number,
      seed_date: form.dateAdded,
      initial_count: Number(form.initialCount),
      status: form.status
    })

    batches.value.push(mapBatch(createdBatch))
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось добавить партию'
    return
  }

  closeModal()
}

onMounted(loadData)
</script>

<style scoped>
.batches-page {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
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

.primary-button {
  border: none;
  border-radius: 14px;
  background: #2d9cdb;
  color: #ffffff;
  padding: 13px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(23, 50, 77, 0.34);
}

.batch-modal {
  width: min(520px, 100%);
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 24px 70px rgba(20, 44, 66, 0.22);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
}

.close-button,
.secondary-button {
  border: none;
  border-radius: 10px;
  background: #eef3f7;
  color: #52677a;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.close-button {
  width: 34px;
  height: 34px;
  font-size: 22px;
  line-height: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.form-group label {
  color: #34495e;
  font-size: 14px;
  font-weight: 600;
}

.form-group input,
.form-group select {
  height: 44px;
  border: 1px solid #d7e2ea;
  border-radius: 10px;
  padding: 0 12px;
  color: #17324d;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #2d9cdb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.secondary-button {
  padding: 12px 16px;
}

.primary-button:hover {
  background: #238ac3;
}

.content-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 26px;
  box-shadow: 0 12px 30px rgba(20, 44, 66, 0.07);
  overflow-x: auto;
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

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  color: #6b7c8f;
  font-size: 14px;
  padding: 18px 22px;
  border-bottom: 1px solid #e1eaf0;
}

td {
  padding: 18px 22px;
  border-bottom: 1px solid #edf2f6;
  font-size: 15px;
}

.page-link {
  color: #1f84bb;
  font-weight: 700;
  text-decoration: none;
}

.page-link:hover {
  text-decoration: underline;
}

.status {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.status.active {
  background: #e8f5fc;
  color: #2d9cdb;
}

.status.completed {
  background: #f5f5f5;
  color: #6b7c8f;
}

.status.lost {
  background: #ffe8e6;
  color: #d93025;
}

.status.archived {
  background: #eef3f7;
  color: #52677a;
}

@media (max-width: 650px) {
  .batches-page {
    padding: 18px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .primary-button {
    width: 100%;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }
}
</style>
