# Alfa Income Modelling App

Веб-приложение для моделирования дохода, разрабатываемое в рамках хакатона [**Changellenge Hack&Change 2025**](https://changellenge.com/championships/khakaton-hack-change-2025/).

## Кейс
**Построение модели дохода от Альфа-Банка**

Задача кейса — разработка веб-сервиса и алгоритмов для моделирования и прогнозирования доходов.

## Авторы

**Команда**: Diet Mountain Data

* [Зверева Анастасия](https://github.com/zvrva) - ML-инженер
* [Попов Вадим](https://github.com/h4cktivist) - Backend-разработчик
* [Селиванова Анастасия](https://github.com/selivanova-a) - Frontend-разработчик

## Структура проекта

* `/backend` - backend веб-приложения (FastAPI)
* `/frontend` - frontend веб-приложения (React)

## Запуск

### Требования
* Docker
* Docker Compose

### Инструкция
1. Клонируйте репозиторий.
2. Запустите приложение:
   ```bash
   docker-compose up --build
   ```
3. Примените миграции базы данных:
   ```bash
   docker-compose exec backend alembic upgrade head
   ```
4. API будет доступно по адресу: [http://localhost:8000/docs](http://localhost:8000/docs)
