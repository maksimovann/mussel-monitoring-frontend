<template>
  <div class="line-detail-page">
    <header class="page-header">
      <div>
        <button class="back-button" @click="goBack">← Назад</button>
        <h1>{{ line.name || 'Линия' }}</h1>
        <p>Канат мониторинга на участке {{ locationName }}</p>
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
        <p v-if="isLoading" class="state-text">Загрузка...</p>
        <p v-if="error" class="error-text">{{ error }}</p>
        <p v-if="successMessage" class="success-text">{{ successMessage }}</p>

        <div v-if="activeTab === 'sensors'" class="tab-pane">
          <button class="primary-button" type="button" @click="toggleSensorForm">
            {{ isSensorFormOpen ? 'Скрыть форму' : 'Добавить датчик' }}
          </button>

          <form v-if="isSensorFormOpen" class="inline-form" @submit.prevent="saveSensor">
            <div class="form-row">
              <div class="form-group">
                <label for="sensor-name">Название</label>
                <input id="sensor-name" v-model="sensorForm.name" type="text" required />
              </div>

              <div class="form-group">
                <label for="sensor-type">Тип</label>
                <select id="sensor-type" v-model="sensorForm.sensor_type" required>
                  <option value="temperature">Тип 1</option>
                  <option value="salinity">Тип 2</option>
                  <option value="oxygen">Тип 3</option>
                  <option value="turbidity">Тип 4</option>
                  <option value="depth">Тип 5</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="sensor-serial">Серийный номер</label>
                <input id="sensor-serial" v-model="sensorForm.serial_number" type="text" required />
              </div>

              <label class="switch-field">
                <input v-model="sensorForm.is_active" type="checkbox" />
                <span class="switch-control"></span>
                <span class="switch-label">Активен</span>
              </label>
            </div>

            <button class="secondary-submit" type="submit">Сохранить датчик</button>
          </form>

          <table class="detail-table">
            <thead>
              <tr>
                <th>Название датчика</th>
                <th>Тип</th>
                <th>Серийный номер</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sensor in sensors" :key="sensor.id">
                <td class="text-cell">{{ sensor.name }}</td>
                <td>{{ sensor.type }}</td>
                <td class="text-cell">{{ sensor.serialNumber }}</td>
                <td>{{ sensor.isActive ? 'активен' : 'неактивен' }}</td>
              </tr>
              <tr v-if="!isLoading && !sensors.length">
                <td colspan="4" class="empty-cell">Датчики пока не добавлены</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'history'" class="tab-pane">
          <button class="primary-button" type="button" @click="toggleEventForm">
            {{ isEventFormOpen ? 'Скрыть форму' : 'Добавить запись' }}
          </button>

          <form v-if="isEventFormOpen" class="inline-form" @submit.prevent="saveEvent">
            <div class="form-group">
              <label for="event-type">Событие</label>
              <input id="event-type" v-model="eventForm.event_type" type="text" required />
            </div>

            <div class="form-row compact-row">
              <div class="form-group">
                <label for="event-date">Дата</label>
                <input id="event-date" v-model="eventForm.event_date" type="date" required />
              </div>

              <div class="form-group">
                <label for="event-time">Время</label>
                <input id="event-time" v-model="eventForm.event_time" type="time" required />
              </div>
            </div>

            <div class="form-group">
              <label for="event-description">Описание</label>
              <textarea id="event-description" v-model="eventForm.description" rows="3" required></textarea>
            </div>

            <button class="secondary-submit" type="submit">Сохранить запись</button>
          </form>

          <table class="detail-table history-table">
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
                <td class="text-cell">{{ event.event }}</td>
                <td class="long-text-cell">{{ event.description }}</td>
              </tr>
              <tr v-if="!isLoading && !history.length">
                <td colspan="3" class="empty-cell">История пока не добавлена</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'batches'" class="tab-pane">
          <table class="detail-table">
            <thead>
              <tr>
                <th>Номер партии</th>
                <th>Дата посадки</th>
                <th>Начальное количество</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="batch in batches" :key="batch.id">
                <td>
                  <RouterLink :to="`/batches/${batch.id}`" class="page-link">
                    {{ batch.number }}
                  </RouterLink>
                </td>
                <td>{{ batch.seedDate }}</td>
                <td>{{ batch.quantity }}</td>
              </tr>
              <tr v-if="!isLoading && !batches.length">
                <td colspan="3" class="empty-cell">Партии мидий пока не добавлены</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { apiGet, apiPost } from '../api'

const router = useRouter()
const route = useRoute()
const activeTab = ref('sensors')
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

const tabs = [
  { id: 'sensors', label: 'Текущие датчики' },
  { id: 'history', label: 'История' },
  { id: 'batches', label: 'Партии мидий' }
]

const sensorTypeLabels = {
  temperature: 'Тип 1',
  salinity: 'Тип 2',
  oxygen: 'Тип 3',
  turbidity: 'Тип 4',
  depth: 'Тип 5'
}

const line = ref({
  id: Number(route.params.id || 1),
  name: '',
  location_id: '',
  length: '',
  status: ''
})

const location = ref({
  id: '',
  name: ''
})

const sensors = ref([])
const history = ref([])
const batches = ref([])

const isSensorFormOpen = ref(false)
const isEventFormOpen = ref(false)

const sensorForm = reactive({
  name: '',
  sensor_type: 'temperature',
  serial_number: '',
  is_active: true
})

const eventForm = reactive({
  event_type: '',
  description: '',
  event_date: '',
  event_time: ''
})

const locationName = computed(() => location.value?.name || `Участок ${line.value.location_id || ''}`)

const formatDate = (date) => {
  if (!date) {
    return ''
  }

  return new Date(date).toLocaleDateString('ru-RU')
}

const resetSensorForm = () => {
  sensorForm.name = ''
  sensorForm.sensor_type = 'temperature'
  sensorForm.serial_number = ''
  sensorForm.is_active = true
}

const resetEventForm = () => {
  eventForm.event_type = ''
  eventForm.description = ''
  eventForm.event_date = ''
  eventForm.event_time = ''
}

const toggleSensorForm = () => {
  isSensorFormOpen.value = !isSensorFormOpen.value
}

const toggleEventForm = () => {
  isEventFormOpen.value = !isEventFormOpen.value
}

watch(activeTab, () => {
  error.value = ''
  successMessage.value = ''
})

const loadLine = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const lineId = Number(route.params.id)
    const loadedLine = await apiGet(`/lines/${lineId}`)
    line.value = loadedLine

    const [loadedLocation, loadedSensors, loadedEvents, loadedBatches] = await Promise.all([
      apiGet(`/locations/${loadedLine.location_id}`).catch(() => null),
      Array.isArray(loadedLine.sensors) ? Promise.resolve(loadedLine.sensors) : apiGet('/sensors').catch(() => []),
      Array.isArray(loadedLine.operational_events) ? Promise.resolve(loadedLine.operational_events) : apiGet('/events').catch(() => []),
      Array.isArray(loadedLine.mussel_batches) ? Promise.resolve(loadedLine.mussel_batches) : apiGet('/batches').catch(() => [])
    ])

    location.value = loadedLocation || { id: loadedLine.location_id, name: `Участок ${loadedLine.location_id}` }

    sensors.value = loadedSensors
      .filter((sensor) => sensor.line_id === lineId || Array.isArray(loadedLine.sensors))
      .map((sensor) => ({
        id: sensor.id,
        name: sensor.name,
        type: sensorTypeLabels[sensor.sensor_type] || sensor.sensor_type,
        serialNumber: sensor.serial_number || 'не указан',
        isActive: sensor.is_active
      }))

    history.value = loadedEvents
      .filter((event) => event.line_id === lineId || Array.isArray(loadedLine.operational_events))
      .map((event) => ({
        id: event.id,
        date: formatDate(event.event_time),
        event: event.event_type,
        description: event.description
      }))

    batches.value = loadedBatches
      .filter((batch) => batch.line_id === lineId || Array.isArray(loadedLine.mussel_batches))
      .map((batch) => ({
        id: batch.id,
        number: batch.batch_number,
        seedDate: formatDate(batch.seed_date),
        quantity: `${batch.initial_count} шт.`
      }))
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось загрузить линию'
    line.value = {
      id: Number(route.params.id || 1),
      name: '',
      location_id: '',
      length: '',
      status: ''
    }
    location.value = { id: '', name: '' }
    sensors.value = []
    history.value = []
    batches.value = []
  } finally {
    isLoading.value = false
  }
}

const saveSensor = async () => {
  error.value = ''
  successMessage.value = ''

  try {
    await apiPost('/sensors', {
      line_id: Number(route.params.id),
      name: sensorForm.name,
      sensor_type: sensorForm.sensor_type,
      serial_number: sensorForm.serial_number,
      is_active: sensorForm.is_active
    })

    successMessage.value = 'Датчик сохранен'
    resetSensorForm()
    isSensorFormOpen.value = false
    await loadLine()
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось сохранить датчик'
  }
}

const saveEvent = async () => {
  error.value = ''
  successMessage.value = ''

  try {
    const eventDateTime = new Date(`${eventForm.event_date}T${eventForm.event_time}`)

    if (Number.isNaN(eventDateTime.getTime())) {
      error.value = 'Проверьте дату и время'
      return
    }

    await apiPost('/events', {
      line_id: Number(route.params.id),
      event_type: eventForm.event_type,
      description: eventForm.description,
      event_time: eventDateTime.toISOString()
    })

    successMessage.value = 'Запись добавлена'
    resetEventForm()
    isEventFormOpen.value = false
    await loadLine()
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось сохранить запись'
  }
}

const goBack = () => {
  router.push(`/locations/${route.query.locationId || line.value.location_id || 1}`)
}

onMounted(loadLine)
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

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.primary-button {
  align-self: flex-start;
  border: none;
  border-radius: 14px;
  background: #2d9cdb;
  color: #ffffff;
  min-height: 46px;
  padding: 0 18px;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 700;
  cursor: pointer;
}

.primary-button:hover {
  background: #238ac3;
}

.inline-form {
  background: #f8fafc;
  border: 1px solid #dfeaf2;
  border-radius: 14px;
  padding: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.form-group label,
.switch-field {
  color: #34495e;
  font-size: 14px;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  min-height: 44px;
  border: 1px solid #d7e2ea;
  border-radius: 10px;
  padding: 0 12px;
  color: #17324d;
  font-family: inherit;
  font-size: 14px;
  outline: none;
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

.switch-field {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  margin-top: 23px;
  cursor: pointer;
}

.switch-field input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch-control {
  position: relative;
  flex: 0 0 auto;
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: #d7e2ea;
  transition: background 0.2s;
}

.switch-control::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 2px 5px rgba(20, 44, 66, 0.2);
  transition: transform 0.2s;
}

.switch-field input:checked + .switch-control {
  background: #2d9cdb;
}

.switch-field input:checked + .switch-control::after {
  transform: translateX(18px);
}

.switch-label {
  color: #34495e;
  font-size: 14px;
  font-weight: 600;
}

.secondary-submit {
  min-height: 42px;
  border: none;
  border-radius: 12px;
  background: #e8f5fc;
  color: #1f84bb;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.state-text,
.error-text,
.success-text {
  margin: 0 0 16px;
  font-size: 14px;
}

.state-text {
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
}

th {
  text-align: left;
  color: #6b7c8f;
  font-size: 14px;
  padding: 16px 18px;
  border-bottom: 1px solid #e1eaf0;
  white-space: nowrap;
}

td {
  padding: 16px 18px;
  border-bottom: 1px solid #edf2f6;
  font-size: 15px;
  line-height: 1.45;
  vertical-align: top;
}

.detail-table th,
.detail-table td {
  min-width: 0;
}

.history-table th:nth-child(1),
.history-table td:nth-child(1) {
  width: 140px;
}

.history-table th:nth-child(2),
.history-table td:nth-child(2) {
  width: 28%;
}

.text-cell,
.long-text-cell {
  line-height: 1.45;
  overflow-wrap: anywhere;
  word-break: normal;
  white-space: normal;
}

.empty-cell {
  color: #6b7c8f;
  text-align: center;
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

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
