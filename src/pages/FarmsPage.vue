<template>
  <div class="farms-page">
    <header class="page-header">
      <div>
        <h1>Фермы</h1>
        <p>Список мидийных ферм и их участков</p>
      </div>

      <button class="primary-button" @click="openAddModal">Добавить ферму</button>
    </header>

    <section class="content-card">
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Регион</th>
            <th class="text-center">Участков</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="farm in farms" :key="farm.id">
            <td>
              <RouterLink :to="`/farms/${farm.id}`" class="page-link">
                {{ farm.name }}
              </RouterLink>
            </td>
            <td>{{ farm.region }}</td>
            <td class="text-center">
              <RouterLink :to="`/farms/${farm.id}?tab=locations`" class="page-link">
                {{ farm.locationsCount }}
              </RouterLink>
            </td>
            <td>
              <div class="actions">
                <RouterLink :to="`/farms/${farm.id}`" class="text-button">
                  Открыть
                </RouterLink>
                <button class="action-button edit" @click="openEditModal(farm)">Редактировать</button>
                <button class="action-button delete" @click="deleteFarm(farm.id)">Удалить</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
      <form class="farm-modal" @submit.prevent="saveFarm">
        <div class="modal-header">
          <h2>{{ editingFarmId ? 'Редактировать ферму' : 'Добавить ферму' }}</h2>
          <button class="close-button" type="button" @click="closeModal">×</button>
        </div>

        <div class="form-group">
          <label for="farm-name">Название</label>
          <input id="farm-name" v-model="form.name" type="text" required />
        </div>

        <div class="form-group">
          <label for="farm-region">Регион</label>
          <input id="farm-region" v-model="form.region" type="text" required />
        </div>

        <div class="form-group">
          <label for="farm-description">Описание</label>
          <textarea id="farm-description" v-model="form.description" rows="4" required></textarea>
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
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

const farms = ref([
  { id: 1, name: 'Ферма 1', region: 'Регион 1', description: 'Описание фермы 1', locationsCount: 2 },
  { id: 2, name: 'Ферма 2', region: 'Регион 2', description: 'Описание фермы 2', locationsCount: 1 },
  { id: 3, name: 'Ферма 3', region: 'Регион 1', description: 'Описание фермы 3', locationsCount: 2 }
])

const isModalOpen = ref(false)
const editingFarmId = ref(null)

const form = reactive({
  name: '',
  region: '',
  description: ''
})

const resetForm = () => {
  form.name = ''
  form.region = ''
  form.description = ''
}

const openAddModal = () => {
  editingFarmId.value = null
  resetForm()
  isModalOpen.value = true
}

const openEditModal = (farm) => {
  editingFarmId.value = farm.id
  form.name = farm.name
  form.region = farm.region
  form.description = farm.description
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const saveFarm = () => {
  if (editingFarmId.value) {
    const farm = farms.value.find((item) => item.id === editingFarmId.value)

    if (farm) {
      farm.name = form.name
      farm.region = form.region
      farm.description = form.description
    }
  } else {
    farms.value.push({
      id: Date.now(),
      name: form.name,
      region: form.region,
      description: form.description,
      locationsCount: 0
    })
  }

  closeModal()
}

const deleteFarm = (id) => {
  farms.value = farms.value.filter((farm) => farm.id !== id)
}
</script>

<style scoped>
.farms-page {
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

.primary-button,
.action-button,
.text-button,
.secondary-button,
.close-button {
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.primary-button {
  border-radius: 14px;
  background: #2d9cdb;
  color: #ffffff;
  padding: 13px 18px;
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

.text-center {
  text-align: center;
}

.page-link {
  color: #1f84bb;
  font-weight: 700;
  text-decoration: none;
}

.page-link:hover {
  text-decoration: underline;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.text-button {
  background: #e8f5fc;
  color: #2d9cdb;
  padding: 8px 10px;
}

.text-button:hover {
  background: #d6edf8;
}

.action-button {
  padding: 8px 14px;
  transition: all 0.2s;
}

.action-button.edit {
  background: #e3f2fd;
  color: #1976d2;
}

.action-button.delete {
  background: #ffebee;
  color: #d32f2f;
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

.farm-modal {
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
.form-group textarea {
  height: 44px;
  border: 1px solid #d7e2ea;
  border-radius: 10px;
  padding: 0 12px;
  color: #17324d;
  outline: none;
}

.form-group textarea {
  height: auto;
  min-height: 96px;
  padding: 10px 12px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #2d9cdb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.secondary-button {
  background: #eef3f7;
  color: #52677a;
  padding: 12px 16px;
}

@media (max-width: 650px) {
  .farms-page {
    padding: 18px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .primary-button {
    width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }
}
</style>
