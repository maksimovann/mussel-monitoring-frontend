<template>
  <router-view v-if="isAuthPage" />

  <div v-else class="app-shell">
    <aside class="side-menu">
      <div class="side-menu__brand">
        <span class="side-menu__mark">MM</span>
        <div>
          <strong>Мониторинг мидий</strong>
          <span>Панель управления</span>
        </div>
      </div>

      <nav class="side-menu__nav" aria-label="Основная навигация">
        <RouterLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="side-menu__link"
        >
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="app-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const isAuthPage = computed(() => route.path === '/login')

const menuItems = [
  { path: '/dashboard', label: 'Главная панель' },
  { path: '/farms', label: 'Фермы' },
  { path: '/batches', label: 'Партии мидий' },
  { path: '/observations', label: 'Наблюдения' }
]
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Open Sans', Arial, sans-serif;
  background: #f4f8fb;
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;
  background: #f4f8fb;
}

.side-menu {
  position: sticky;
  top: 0;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #dfeaf1;
  padding: 24px 18px;
}

.side-menu__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 26px;
  color: #17324d;
}

.side-menu__brand strong {
  display: block;
  font-size: 16px;
  line-height: 1.25;
}

.side-menu__brand span:last-child {
  display: block;
  margin-top: 3px;
  color: #6b7c8f;
  font-size: 12px;
}

.side-menu__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #2d9cdb;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
}

.side-menu__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.side-menu__link {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 46px;
  padding: 10px 12px;
  border-radius: 12px;
  color: #52677a;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
}

.side-menu__link:hover {
  background: #eef7fc;
  color: #17324d;
}

.side-menu__link.router-link-active {
  background: #e8f5fc;
  color: #1f84bb;
}

.app-content {
  min-width: 0;
}

@media (max-width: 760px) {
  .app-shell {
    display: block;
  }

  .side-menu {
    position: static;
    height: auto;
    padding: 14px;
    border-right: none;
    border-bottom: 1px solid #dfeaf1;
  }

  .side-menu__brand {
    padding: 4px 4px 14px;
  }

  .side-menu__nav {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .side-menu__link {
    flex: 0 0 auto;
  }
}
</style>
