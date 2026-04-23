# API Specification for Timesheet Application

## Base URL
`/api/v1`

## Endpoints

### Employees

#### GET /employees
Получить список всех сотрудников с поддержкой фильтрации и пагинации.

**Query Parameters:**
- `search` (string, optional): Поиск по ФИО
- `department` (string, optional): Фильтр по подразделению
- `page` (number, optional): Номер страницы (default: 1)
- `limit` (number, optional): Количество записей на странице (default: 50)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "fullName": "string",
      "department": "string",
      "hourlyRate": number,
      "position": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "meta": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

#### GET /employees/:id
Получить данные конкретного сотрудника.

**Response:**
```json
{
  "id": "string",
  "fullName": "string",
  "department": "string",
  "hourlyRate": number,
  "position": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### POST /employees
Создать нового сотрудника.

**Request Body:**
```json
{
  "fullName": "string (required)",
  "department": "string (required)",
  "hourlyRate": "number (required)",
  "position": "string (optional)"
}
```

#### PUT /employees/:id
Обновить данные сотрудника.

#### DELETE /employees/:id
Удалить сотрудника.

---

### Timesheet Entries

#### GET /timesheet
Получить записи табеля за указанный период.

**Query Parameters:**
- `year` (number, required): Год
- `month` (number, required): Месяц (0-11)
- `employeeId` (string, optional): Фильтр по сотруднику
- `department` (string, optional): Фильтр по подразделению

**Response:**
```json
{
  "entries": [
    {
      "id": "string",
      "employeeId": "string",
      "date": "date",
      "hours": number,
      "type": "string",
      "comment": "string"
    }
  ],
  "summary": {
    "employeeId": {
      "totalHours": number,
      "totalSalary": number,
      "workingDays": number,
      "weekendDays": number
    }
  }
}
```

#### GET /timesheet/:employeeId
Получить записи табеля конкретного сотрудника.

#### POST /timesheet/bulk
Массовое создание/обновление записей табеля.

**Request Body:**
```json
{
  "entries": [
    {
      "employeeId": "string",
      "date": "date",
      "hours": number,
      "type": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": boolean,
  "updated": number,
  "created": number
}
```

#### PUT /timesheet/:id
Обновить запись табеля.

#### DELETE /timesheet/:id
Удалить запись табеля.

---

### Departments

#### GET /departments
Получить список всех подразделений.

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "employeeCount": number
  }
]
```

#### POST /departments
Создать новое подразделение.

---

### Reports

#### GET /reports/monthly
Получить ежемесячный отчет.

**Query Parameters:**
- `year` (number, required)
- `month` (number, required)
- `department` (string, optional)

**Response:**
```json
{
  "period": {
    "year": number,
    "month": number,
    "workingDays": number,
    "weekendDays": number
  },
  "summary": {
    "totalEmployees": number,
    "totalHours": number,
    "totalSalary": number,
    "averageHours": number
  },
  "byDepartment": [
    {
      "name": "string",
      "totalHours": number,
      "totalSalary": number,
      "employeeCount": number
    }
  ]
}
```

#### GET /reports/employee/:id
Получить отчет по конкретному сотруднику.

---

## Attendance Types

| Code | Description     | Default Hours |
|------|-----------------|---------------|
| Я    | Явка            | 8             |
| Б    | Больничный      | 0             |
| О    | Отпуск          | 0             |
| К    | Командировка    | 8             |
| Н    | Неявка          | 0             |
| В    | Выходной        | 0             |
| ПР   | Праздничный день| 0             |

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Ошибка валидации данных
- `NOT_FOUND` - Ресурс не найден
- `UNAUTHORIZED` - Требуется авторизация
- `FORBIDDEN` - Доступ запрещен
- `CONFLICT` - Конфликт данных
- `SERVER_ERROR` - Внутренняя ошибка сервера

---

## Authentication

Все endpoints требуют JWT аутентификации через header:
```
Authorization: Bearer <token>
```

### POST /auth/login
Получить токен доступа.

### POST /auth/refresh
Обновить токен доступа.

### POST /auth/logout
Выйти из системы.
