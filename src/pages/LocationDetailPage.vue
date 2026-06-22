<template>
  <div class="location-detail-page">
    <header class="page-header">
      <div>
        <button class="back-button" @click="goBack">← Назад</button>
        <h1>{{ location.name }}</h1>
        <p>Участок фермы {{ farmName }}</p>
      </div>
    </header>

    <section class="content-card">
      <p v-if="error" class="error-text">{{ error }}</p>

      <div class="info-container">
        <div class="info-item">
          <label>Координаты</label>
          <p>{{ location.latitude }}, {{ location.longitude }}</p>
        </div>
        <div class="info-item">
          <label>Глубина</label>
          <p>{{ location.depth }} м</p>
        </div>
      </div>
    </section>

    <section class="content-card">
      <div class="card-header">
        <h2>Список линий</h2>
        <button class="primary-button" @click="openLineModal">Добавить линию</button>
      </div>

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
              <RouterLink :to="`/lines/${line.id}?locationId=${location.id}`" class="page-link">
                {{ line.name }}
              </RouterLink>
            </td>
            <td>{{ line.length }} м</td>
            <td>{{ statusLabel(line.status) }}</td>
          </tr>
          <tr v-if="!lines.length">
            <td colspan="3" class="empty-cell">Линии пока не добавлены</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="isLineModalOpen" class="modal-backdrop" @click.self="closeLineModal">
      <form class="entity-modal" @submit.prevent="saveLine">
        <div class="modal-header">
          <h2>Добавить линию</h2>
          <button class="close-button" type="button" @click="closeLineModal">×</button>
        </div>

        <div class="form-group">
          <label for="line-name">Название линии</label>
          <input id="line-name" v-model="lineForm.name" type="text" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="line-depth">Глубина</label>
            <input id="line-depth" v-model.number="lineForm.depth" type="number" min="0" step="0.01" required />
          </div>

          <div class="form-group">
            <label for="line-length">Длина</label>
            <input id="line-length" v-model.number="lineForm.length" type="number" min="0" step="0.01" required />
          </div>
        </div>

        <div class="form-group">
          <label for="line-status">Статус</label>
          <select id="line-status" v-model="lineForm.status" required>
            <option value="active">Активна</option>
            <option value="inactive">Неактивна</option>
            <option value="maintenance">На обслуживании</option>
          </select>
        </div>

        <div class="modal-actions">
          <button class="secondary-button" type="button" @click="closeLineModal">Отмена</button>
          <button class="primary-button" type="submit">Сохранить</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { apiGet, apiPost } from '../api'

const router = useRouter()
const route = useRoute()

const location = ref({
  id: Number(route.params.id || 1),
  name: '',
  farm_id: '',
  latitude: '',
  longitude: '',
  depth: ''
})

const farmName = ref('')
const lines = ref([])
const error = ref('')
const isLineModalOpen = ref(false)

const lineForm = reactive({
  name: '',
  depth: '',
  length: '',
  status: 'active'
})

const resetLineForm = () => {
  lineForm.name = ''
  lineForm.depth = ''
  lineForm.length = ''
  lineForm.status = 'active'
}

const openLineModal = () => {
  resetLineForm()
  isLineModalOpen.value = true
}

const closeLineModal = () => {
  isLineModalOpen.value = false
}

const statusLabels = {
  active: 'Активна',
  inactive: 'Неактивна',
  maintenance: 'На обслуживании',
  completed: 'Завершена',
  lost: 'Утрачена',
  archived: 'Архивная'
}

const statusLabel = (status) => statusLabels[status] || status || 'не указан'

const loadLocation = async () => {
  try {
    error.value = ''
    const data = await apiGet(`/locations/${route.params.id}`)
    location.value = data
    lines.value = data.lines || []

    try {
      const farm = await apiGet(`/farms/${data.farm_id}`)
      farmName.value = farm.name
    } catch {
      farmName.value = `Ферма ${data.farm_id}`
    }
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось загрузить участок'
    location.value = {
      id: Number(route.params.id || 1),
      name: '',
      farm_id: '',
      latitude: '',
      longitude: '',
      depth: ''
    }
    farmName.value = ''
    lines.value = []
  }
}

const saveLine = async () => {
  try {
    const createdLine = await apiPost('/lines', {
      location_id: Number(route.params.id),
      name: lineForm.name,
      depth: Number(lineForm.depth),
      length: Number(lineForm.length),
      status: lineForm.status
    })

    lines.value.push(createdLine)
    closeLineModal()
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось добавить линию'
  }
}

const goBack = () => {
  router.push(`/farms/${location.value.farm_id}?tab=locations`)
}

onMounted(loadLocation)
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

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.content-card h2 {
  margin: 0;
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

.primary-button,
.secondary-button,
.close-button {
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.primary-button {
  border-radius: 14px;
  background: #2d9cdb;
  color: #ffffff;
  padding: 13px 18px;
}

.secondary-button {
  background: #eef3f7;
  color: #52677a;
  padding: 12px 16px;
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

.entity-modal {
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

.close-button {
  width: 34px;
  height: 34px;
  background: #eef3f7;
  color: #52677a;
  font-size: 22px;
  line-height: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
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

.error-text {
  margin: 0 0 16px;
  color: #d93025;
  font-size: 14px;
}

.empty-cell {
  color: #6b7c8f;
  text-align: center;
}

@media (max-width: 650px) {
  .location-detail-page {
    padding: 18px;
  }

  .info-container,
  .form-row {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .primary-button {
    width: 100%;
  }
}
</style>
