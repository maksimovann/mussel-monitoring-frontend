# Frontend-часть системы мониторинга выращивания мидий.

## Просмотр

Проект можно открыть через GitHub Pages:

```text
https://maksimovann.github.io/mussel-monitoring-frontend/
```

## Стек

- Vue 3
- Vue Router
- Vite
- JavaScript

## Требования

Для локального запуска нужен Node.js и npm.

Проверить установку можно командами:

```bash
node -v
npm -v
```

## Установка и запуск локально

1. Склонировать репозиторий:

```bash
git clone https://github.com/maksimovann/mussel-monitoring-frontend.git
```

2. Перейти в папку проекта:

```bash
cd mussel-monitoring-frontend
```

3. Установить зависимости:

```bash
npm install
```

4. Если backend запущен отдельно на `http://localhost:3000`, дополнительных настроек для локального запуска не требуется: Vite проксирует `/api` на backend.

При необходимости можно создать `.env.local` и указать другой адрес API:

```bash
VITE_API_URL=http://localhost:3000/api
```

5. Запустить проект:

```bash
npm run dev
```

6. Открыть в браузере адрес, который появится в терминале. Обычно:

```text
http://localhost:5173/
```

## Проверка сборки

```bash
npm run build
```

## Просмотр production-сборки локально

Сначала выполнить:

```bash
npm run build
```

Затем:

```bash
npm run preview
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
- `/observations` - форма наблюдений биолога

## Примечание

В проекте реализована frontend-часть. Frontend подготовлен к работе с backend API:

- `POST /api/auth/login`
- `GET /api/farms`
- `POST /api/farms`
- `PUT /api/farms/:id`
- `DELETE /api/farms/:id`
- `GET /api/lines`
- `GET /api/batches`
- `POST /api/batches`
- `POST /api/observations`

Если backend не запущен или пользователь не авторизован, часть страниц может показывать временные демонстрационные данные.
