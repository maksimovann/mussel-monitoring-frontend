<template>
  <div class="farm-detail-page">
    <header class="page-header">
      <div>
        <button class="back-button" @click="goBack">← Назад</button>
        <h1>{{ farm.name }}</h1>
        <p>{{ farm.region }}</p>
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
        <p v-if="error" class="error-text">{{ error }}</p>

        <div v-if="activeTab === 'info'" class="tab-pane">
          <div class="info-container">
            <div class="info-item">
              <label>Название</label>
              <p>{{ farm.name }}</p>
            </div>
            <div class="info-item">
              <label>Регион</label>
              <p>{{ farm.region }}</p>
            </div>
            <div class="info-item">
              <label>Описание</label>
              <p>{{ farm.description }}</p>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'locations'" class="tab-pane">
          <div class="items-list">
            <button class="add-tile" @click="openLocationModal">
              <span>+</span>
              Добавить участок
            </button>
            <RouterLink
              v-for="location in locations"
              :key="location.id"
              :to="`/locations/${location.id}`"
              class="list-item"
            >
              <div>
                <div class="item-name">{{ location.name }}</div>
                <div class="item-meta">{{ formatCoordinates(location) }} · глубина {{ formatDepth(location.depth) }}</div>
              </div>
            </RouterLink>
            <p v-if="!locations.length" class="empty-state">Участки пока не добавлены</p>
          </div>
        </div>

        <div v-if="activeTab === 'lines'" class="tab-pane">
          <div class="items-list">
            <button class="add-tile" @click="openLineModal">
              <span>+</span>
              Добавить линию
            </button>
            <RouterLink
              v-for="line in lines"
              :key="line.id"
              :to="`/lines/${line.id}?locationId=${line.location_id}`"
              class="list-item"
            >
              <div>
                <div class="item-name">{{ line.name }}</div>
                <div class="item-meta">{{ line.location }} · {{ formatDepth(line.length) }} · {{ statusLabel(line.status) }}</div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <div v-if="isLocationModalOpen" class="modal-backdrop" @click.self="closeLocationModal">
      <form class="entity-modal" @submit.prevent="saveLocation">
        <div class="modal-header">
          <h2>Добавить участок</h2>
          <button class="close-button" type="button" @click="closeLocationModal">×</button>
        </div>

        <div class="form-group">
          <label for="location-name">Название участка</label>
          <input id="location-name" v-model="locationForm.name" type="text" required />
        </div>

        <div class="form-group">
          <label for="location-coordinates">Координаты</label>
          <input id="location-coordinates" v-model="locationForm.coordinates" type="text" placeholder="1.1, 1.1" required />
        </div>

        <div class="form-group">
          <label for="location-depth">Глубина</label>
          <input id="location-depth" v-model.number="locationForm.depth" type="number" min="0" step="0.01" required />
        </div>

        <p v-if="modalError" class="error-text">{{ modalError }}</p>

        <div class="modal-actions">
          <button class="secondary-button" type="button" @click="closeLocationModal">Отмена</button>
          <button class="primary-button" type="submit">Сохранить</button>
        </div>
      </form>
    </div>

    <div v-if="isLineModalOpen" class="modal-backdrop" @click.self="closeLineModal">
      <form class="entity-modal" @submit.prevent="saveLine">
        <div class="modal-header">
          <h2>Добавить линию</h2>
          <button class="close-button" type="button" @click="closeLineModal">×</button>
        </div>

        <div class="form-group">
          <label for="line-location">Участок</label>
          <select id="line-location" v-model.number="lineForm.location_id" required>
            <option value="">Выберите участок</option>
            <option v-for="location in locations" :key="location.id" :value="location.id">
              {{ location.name }}
            </option>
          </select>
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

        <p v-if="modalError" class="error-text">{{ modalError }}</p>

        <div class="modal-actions">
          <button class="secondary-button" type="button" @click="closeLineModal">Отмена</button>
          <button class="primary-button" type="submit">Сохранить</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { apiGet, apiPost } from '../api'

const router = useRouter()
const route = useRoute()

const tabs = [
  { id: 'info', label: 'Общая информация' },
  { id: 'locations', label: 'Участки' },
  { id: 'lines', label: 'Линии' }
]

const initialTab = tabs.some((tab) => tab.id === route.query.tab) ? route.query.tab : 'info'
const activeTab = ref(initialTab)
const error = ref('')
const modalError = ref('')
const isLocationModalOpen = ref(false)
const isLineModalOpen = ref(false)

const farm = ref({
  id: Number(route.params.id || 1),
  name: '',
  region: '',
  description: ''
})

const locations = ref([])
const lines = ref([])

const locationForm = reactive({
  name: '',
  coordinates: '',
  depth: ''
})

const lineForm = reactive({
  location_id: '',
  name: '',
  depth: '',
  length: '',
  status: 'active'
})

const resetLocationForm = () => {
  locationForm.name = ''
  locationForm.coordinates = ''
  locationForm.depth = ''
}

const resetLineForm = () => {
  lineForm.location_id = ''
  lineForm.name = ''
  lineForm.depth = ''
  lineForm.length = ''
  lineForm.status = 'active'
}

const openLocationModal = () => {
  error.value = ''
  modalError.value = ''
  resetLocationForm()
  isLocationModalOpen.value = true
}

const openLineModal = () => {
  error.value = ''
  modalError.value = ''
  resetLineForm()
  isLineModalOpen.value = true
}

const closeLocationModal = () => {
  modalError.value = ''
  isLocationModalOpen.value = false
}

const closeLineModal = () => {
  modalError.value = ''
  isLineModalOpen.value = false
}

watch(activeTab, () => {
  error.value = ''
  modalError.value = ''
})

const formatCoordinates = (location) => `${location.latitude}, ${location.longitude}`
const formatDepth = (value) => `${value} м`

const statusLabels = {
  active: 'Активна',
  inactive: 'Неактивна',
  maintenance: 'На обслуживании',
  completed: 'Завершена',
  lost: 'Утрачена',
  archived: 'Архивная'
}

const statusLabel = (status) => statusLabels[status] || status || 'не указан'

const parseCoordinates = (coordinates) => {
  const [latitude, longitude] = coordinates
    .split(',')
    .map((part) => Number(part.trim()))

  return {
    latitude,
    longitude
  }
}

const validateCoordinates = ({ latitude, longitude }) => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return 'Введите координаты в формате: 55.75, 37.62'
  }

  if (latitude < -90 || latitude > 90) {
    return 'Широта должна быть от -90 до 90'
  }

  if (longitude < -180 || longitude > 180) {
    return 'Долгота должна быть от -180 до 180'
  }

  return ''
}

const loadFarm = async () => {
  try {
    error.value = ''
    const [data, loadedLines] = await Promise.all([
      apiGet(`/farms/${route.params.id}`),
      apiGet('/lines')
    ])

    farm.value = data
    locations.value = data.locations || []
    const locationIds = new Set(locations.value.map((location) => location.id))

    lines.value = loadedLines
      .filter((line) => locationIds.has(line.location_id))
      .map((line) => {
        const location = locations.value.find((item) => item.id === line.location_id)

        return {
          ...line,
          location: location?.name || `Участок ${line.location_id}`
        }
      })
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось загрузить ферму'
    farm.value = {
      id: Number(route.params.id || 1),
      name: '',
      region: '',
      description: ''
    }
    locations.value = []
    lines.value = []
  }
}

const saveLocation = async () => {
  error.value = ''
  modalError.value = ''
  const coordinates = parseCoordinates(locationForm.coordinates)
  const coordinatesError = validateCoordinates(coordinates)

  if (coordinatesError) {
    modalError.value = coordinatesError
    return
  }

  try {
    const createdLocation = await apiPost('/locations', {
      farm_id: Number(route.params.id),
      name: locationForm.name,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      depth: Number(locationForm.depth)
    })

    locations.value.push({
      ...createdLocation,
      lines: []
    })

    closeLocationModal()
  } catch (requestError) {
    modalError.value = requestError.message || 'Не удалось добавить участок'
  }
}

const saveLine = async () => {
  error.value = ''
  modalError.value = ''
  const selectedLocation = locations.value.find((location) => location.id === Number(lineForm.location_id))

  try {
    const createdLine = await apiPost('/lines', {
      location_id: Number(lineForm.location_id),
      name: lineForm.name,
      depth: Number(lineForm.depth),
      length: Number(lineForm.length),
      status: lineForm.status
    })

    lines.value.push({
      ...createdLine,
      location: selectedLocation?.name || `Участок ${createdLine.location_id}`
    })

    closeLineModal()
  } catch (requestError) {
    modalError.value = requestError.message || 'Не удалось добавить линию'
  }
}

const goBack = () => {
  router.push('/farms')
}

onMounted(loadFarm)
</script>

<style scoped>
.farm-detail-page {
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
}

.section-actions {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
}

.info-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 680px;
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
  line-height: 1.5;
}

.items-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  align-items: stretch;
}

.list-item {
  background: #f8f9fa;
  border: 1px solid #e1eaf0;
  border-radius: 12px;
  padding: 18px 20px;
  min-height: 102px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.list-item:hover {
  background: #eef7fc;
  border-color: #b9d9ec;
  transform: translateY(-1px);
}

.item-name {
  font-size: 15px;
  font-weight: 700;
  color: #17324d;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.item-meta {
  margin-top: 6px;
  color: #6b7c8f;
  font-size: 13px;
  line-height: 1.45;
  overflow-wrap: anywhere;
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

.add-tile {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 102px;
  height: 100%;
  border: none;
  border-radius: 12px;
  background: #2d9cdb;
  color: #ffffff;
  padding: 18px 20px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
}

.add-tile:hover {
  background: #238ac3;
}

.add-tile span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  font-size: 20px;
  line-height: 1;
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

.empty-state {
  margin: 0;
  color: #6b7c8f;
  font-size: 14px;
}

@media (max-width: 650px) {
  .farm-detail-page {
    padding: 18px;
  }

  .tabs {
    flex-wrap: wrap;
  }

  .items-list,
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
