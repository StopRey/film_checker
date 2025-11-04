# Film Checker

React проєкт створений за допомогою Vite та Tailwind CSS.

## Встановлення залежностей

```bash
npm install
```

## Налаштування змінних середовища

### Для локальної розробки

Створіть файл `.env.local` в корені проєкту та додайте ваш TMDB API ключ:

```bash
VITE_TMDB_API_KEY=your_api_key_here
```

### Для GitHub Actions (CI/CD)

Щоб проєкт збирався на GitHub, потрібно налаштувати секрети:

1. Перейдіть до вашого репозиторію на GitHub
2. Натисніть на **Settings** (Налаштування)
3. У лівому меню виберіть **Secrets and variables** → **Actions**
4. Натисніть **New repository secret**
5. Додайте:
   - **Name**: `VITE_TMDB_API_KEY`
   - **Value**: ваш TMDB API ключ
6. Натисніть **Add secret**

Щоб отримати TMDB API ключ:
1. Зареєструйтесь на [TMDB](https://www.themoviedb.org/)
2. Перейдіть до [Settings > API](https://www.themoviedb.org/settings/api)
3. Запишіть API ключ
4. Додайте його в `.env.local` (для локальної розробки) та в GitHub Secrets (для CI/CD)

## Запуск проєкту

```bash
npm run dev
```

## Збірка

```bash
npm run build
```

## Попередній перегляд продакшн збірки

```bash
npm run preview
```

