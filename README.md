# Alfa Income Modelling App

## О проекте
Веб-приложение для моделирования дохода, разрабатываемое в рамках хакатона **Changellenge Hack&Change 2025**.

## Кейс
**Построение модели дохода от Альфа-Банка**
Задача кейса — разработка веб-сервиса и алгоритмов для моделирования и прогнозирования доходов.

## Хакатон
[Changellenge Hack&Change 2025](https://changellenge.com/championships/khakaton-hack-change-2025/) — это соревнование для IT-специалистов, направленное на решение реальных бизнес-задач от ведущих компаний.

## Авторы
* [zvrva](https://github.com/zvrva) - ML Engineer
* [h4cktivist](https://github.com/h4cktivist) - Backend Developer
* [selivanova-a](https://github.com/selivanova-a) - Frontend Developer

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
