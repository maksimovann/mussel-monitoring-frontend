<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>Вход в систему</h1>
        <p>Система мониторинга роста мидий</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login">Логин</label>
          <input id="login" v-model="login" type="text" placeholder="Введите логин" />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input id="password" v-model="password" type="password" placeholder="Введите пароль" />
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>

        <button type="submit">Войти</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const login = ref('demo')
const password = ref('demo')
const error = ref('')

const handleLogin = () => {
  error.value = ''

  if (!login.value || !password.value) {
    error.value = 'Введите логин и пароль'
    return
  }

  // Сейчас это frontend-заглушка. После подключения backend здесь будет POST /api/auth/login.
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f4f8fb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 24px;
  padding: 36px;
  box-shadow: 0 20px 60px rgba(20, 44, 66, 0.12);
}

.login-header {
  margin-bottom: 28px;
  text-align: center;
}

.login-header h1 {
  margin: 0 0 8px;
  font-size: 28px;
  color: #17324d;
}

.login-header p {
  margin: 0;
  color: #6b7c8f;
  font-size: 15px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #34495e;
  font-weight: 600;
}

.form-group input {
  height: 46px;
  border: 1px solid #d7e2ea;
  border-radius: 12px;
  padding: 0 14px;
  font-size: 15px;
  outline: none;
}

.form-group input:focus {
  border-color: #2d9cdb;
}

button {
  height: 48px;
  border: none;
  border-radius: 14px;
  background: #2d9cdb;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #238ac3;
}

.error-text {
  margin: 0;
  color: #d93025;
  font-size: 14px;
}
</style>
