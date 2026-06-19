<template>
  <div class="batch-detail-page">
    <header class="page-header">
      <div>
        <button class="back-button" @click="goBack">← Назад</button>
        <h1>{{ batch.number }}</h1>
        <p>Партия мидий на {{ batch.line }}</p>
      </div>
    </header>

    <section class="content-card">
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
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const batch = {
  id: 1,
  number: 'Партия 1',
  line: 'Линия 1',
  age: '10 дней',
  weight: '1 г',
  size: '10 мм',
  mortality: '1%'
}

const goBack = () => {
  router.push('/batches')
}
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

.info-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

@media (max-width: 800px) {
  .info-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .batch-detail-page {
    padding: 18px;
  }
}
</style>
