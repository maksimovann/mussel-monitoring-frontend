<template>
  <div class="observations-page">
    <header class="page-header">
      <div>
        <h1>Наблюдения биолога</h1>
        <p>Форма для записи наблюдений за мидиями</p>
      </div>
    </header>

    <section class="content-card">
      <form @submit.prevent="saveObservation" class="observation-form">
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
          <label for="date">Дата</label>
          <input id="date" v-model="form.date" type="date" required />
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
              <option value="excellent">Отлично</option>
              <option value="good">Хорошо</option>
              <option value="satisfactory">Удовлетворительно</option>
              <option value="poor">Плохо</option>
              <option value="critical">Критично</option>
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
            <input id="density" v-model.number="form.density" type="number" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="size">Размер (мм)</label>
            <input id="size" v-model.number="form.size" type="number" required />
          </div>

          <div class="form-group">
            <label for="weight">Вес (г)</label>
            <input id="weight" v-model.number="form.weight" type="number" required />
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
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { apiGet, apiPost } from '../api'

const form = ref({
  object: '',
  date: '',
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

const demoLines = [
  { id: 1, name: 'Линия 1' },
  { id: 2, name: 'Линия 2' }
]

const demoBatches = [
  { id: 1, line_id: 1, batch_number: 'Партия 1' },
  { id: 2, line_id: 2, batch_number: 'Партия 2' }
]

const lines = ref(demoLines)
const batches = ref(demoBatches)
const error = ref('')
const successMessage = ref('')

const objects = computed(() =>
  batches.value.map((batch) => {
    const line = lines.value.find((item) => item.id === batch.line_id)

    return {
      value: `${batch.line_id}:${batch.id}`,
      label: `${line?.name || `Линия ${batch.line_id}`} / ${batch.batch_number}`
    }
  })
)

const loadObjects = async () => {
  try {
    const [loadedLines, loadedBatches] = await Promise.all([
      apiGet('/lines'),
      apiGet('/batches')
    ])

    lines.value = loadedLines.length ? loadedLines : demoLines
    batches.value = loadedBatches.length ? loadedBatches : demoBatches
  } catch {
    lines.value = demoLines
    batches.value = demoBatches
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
      comment: form.value.comment || undefined
    })

    successMessage.value = 'Наблюдение сохранено'
  } catch (requestError) {
    error.value = requestError.message || 'Не удалось сохранить наблюдение'
  }
}

onMounted(loadObjects)
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

.error-text,
.success-text {
  margin: 0;
  font-size: 14px;
}

.error-text {
  color: #d93025;
}

.success-text {
  color: #137333;
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
