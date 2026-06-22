# Frontend системы мониторинга выращивания мидий

Frontend-часть проекта для производственной практики. Приложение реализовано на Vue 3 и работает с backend API.

## Стек

- Vue 3
- Vue Router
- Vite
- JavaScript

## Backend

Backend находится в отдельном репозитории:

```text
https://github.com/Asukaru556/MuselFarm-Backend
```

Для локальной работы backend запускается через Docker:

```bash
docker-compose up --build
```


## Тестовый вход

```text
login: admin_chief
password: password123
```

## Запуск frontend

Установить зависимости:

```bash
npm install
```

Запустить проект:

```bash
npm run dev
```

Открыть приложение:

```text
http://localhost:5173/
```

При локальном запуске frontend отправляет запросы на `/api`, а Vite проксирует их на `http://localhost:3000`.

## Проверка сборки

```bash
npm run build
```

## Основные страницы

- `/login` - авторизация
- `/dashboard` - главная панель
- `/farms` - список ферм
- `/farms/:id` - карточка фермы
- `/locations/:id` - карточка участка
- `/lines/:id` - карточка линии
- `/batches` - список партий мидий
- `/batches/:id` - карточка партии
- `/observations` - наблюдения биолога

## Основные API endpoints

- `POST /api/auth/login`
- `GET /api/farms`
- `POST /api/farms`
- `PUT /api/farms/:id`
- `DELETE /api/farms/:id`
- `GET /api/locations`
- `POST /api/locations`
- `GET /api/lines`
- `GET /api/lines/:id`
- `POST /api/lines`
- `GET /api/batches`
- `POST /api/batches`
- `GET /api/sensors`
- `POST /api/sensors`
- `GET /api/events`
- `POST /api/events`
- `GET /api/observations`
- `POST /api/observations`

## Примечание

GitHub Pages сейчас не используется. Проект рассчитан на локальный запуск frontend и backend.
