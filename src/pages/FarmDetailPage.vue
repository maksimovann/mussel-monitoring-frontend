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
            <RouterLink
              v-for="location in locations"
              :key="location.id"
              :to="`/locations/${location.id}`"
              class="list-item"
            >
              <div>
                <div class="item-name">{{ location.name }}</div>
                <div class="item-meta">{{ location.coordinates }} · глубина {{ location.depth }}</div>
              </div>
            </RouterLink>
          </div>
        </div>

        <div v-if="activeTab === 'lines'" class="tab-pane">
          <div class="items-list">
            <RouterLink
              v-for="line in lines"
              :key="line.id"
              :to="`/lines/${line.id}`"
              class="list-item"
            >
              <div>
                <div class="item-name">{{ line.name }}</div>
                <div class="item-meta">{{ line.location }} · {{ line.length }}</div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  { id: 'info', label: 'Общая информация' },
  { id: 'locations', label: 'Участки' },
  { id: 'lines', label: 'Линии' }
]

const initialTab = tabs.some((tab) => tab.id === route.query.tab) ? route.query.tab : 'info'
const activeTab = ref(initialTab)

const farms = {
  1: {
    id: 1,
    name: 'Ферма 1',
    region: 'Регион 1',
    description: 'Описание фермы 1'
  },
  2: {
    id: 2,
    name: 'Ферма 2',
    region: 'Регион 2',
    description: 'Описание фермы 2'
  },
  3: {
    id: 3,
    name: 'Ферма 3',
    region: 'Регион 1',
    description: 'Описание фермы 3'
  }
}

const farmLocations = {
  1: [
    { id: 1, name: 'Участок 1', coordinates: '1.1, 1.1', depth: '10 м' },
    { id: 2, name: 'Участок 2', coordinates: '2.2, 2.2', depth: '12 м' }
  ],
  2: [
    { id: 3, name: 'Участок 3', coordinates: '3.3, 3.3', depth: '14 м' }
  ],
  3: [
    { id: 4, name: 'Участок 4', coordinates: '4.4, 4.4', depth: '10 м' },
    { id: 5, name: 'Участок 5', coordinates: '5.5, 5.5', depth: '11 м' }
  ]
}

const farmLines = {
  1: [
    { id: 1, name: 'Линия 1', location: 'Участок 1', length: '100 м' },
    { id: 2, name: 'Линия 2', location: 'Участок 2', length: '120 м' }
  ],
  2: [
    { id: 3, name: 'Линия 3', location: 'Участок 3', length: '100 м' }
  ],
  3: [
    { id: 4, name: 'Линия 4', location: 'Участок 4', length: '100 м' },
    { id: 5, name: 'Линия 5', location: 'Участок 5', length: '120 м' }
  ]
}

const farmId = computed(() => String(route.params.id || '1'))
const farm = computed(() => farms[farmId.value] || farms[1])
const locations = computed(() => farmLocations[farmId.value] || farmLocations[1])
const lines = computed(() => farmLines[farmId.value] || farmLines[1])

const goBack = () => {
  router.push('/farms')
}
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
}

.list-item {
  background: #f8f9fa;
  border: 1px solid #e1eaf0;
  border-radius: 12px;
  padding: 18px 20px;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
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
}

.item-meta {
  margin-top: 6px;
  color: #6b7c8f;
  font-size: 13px;
}

@media (max-width: 650px) {
  .farm-detail-page {
    padding: 18px;
  }

  .tabs {
    flex-wrap: wrap;
  }

  .items-list {
    grid-template-columns: 1fr;
  }
}
</style>
