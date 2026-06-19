# Frontend-часть системы мониторинга выращивания мидий.

## Стек

- Vue 3
- Vue Router
- Vite
- JavaScript

## Требования

Для запуска нужен Node.js и npm.

Проверить установку можно командами:

```bash
node -v
npm -v
```

## Установка и запуск

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

4. Запустить проект:

```bash
npm run dev
```

5. Открыть в браузере адрес, который появится в терминале. Обычно:

```text
http://localhost:5173/
```

## Проверка сборки

```bash
npm run build
```

## Просмотр production-сборки

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

В проекте реализована только frontend-часть. Backend и база данных не подключены.

Данные на страницах являются временными демонстрационными данными. После подключения backend их можно заменить на API-запросы к серверу.
