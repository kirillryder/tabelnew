# API Спецификация для системы учета рабочего времени

## Base URL: `/api/v1`

---

## Сотрудники (Employees)

### GET /employees
Получить список всех сотрудников.

**Query Parameters:**
- `search` (string, optional) — поиск по ФИО
- `departmentId` (string, optional) — фильтр по подразделению

**Response:**
```json
[
  {
    "id": "string",
    "fullName": "string",
    "age": number,
    "departmentId": "string",
    "hourlyRate": number,
    "hireDate": "YYYY-MM-DD"
  }
]
```

### GET /employees/:id
Получить данные конкретного сотрудника.

**Response:**
```json
{
  "id": "string",
  "fullName": "string",
  "age": number,
  "departmentId": "string",
  "hourlyRate": number,
  "hireDate": "YYYY-MM-DD"
}
```

### POST /employees
Создать нового сотрудника.

**Request Body:**
```json
{
  "fullName": "string (required)",
  "age": "number (required, min: 18, max: 100)",
  "departmentId": "string (required)",
  "hourlyRate": "number (required, min: 0)",
  "hireDate": "string (required, format: YYYY-MM-DD)"
}
```

**Response:** Created employee object with status 201.

### PUT /employees/:id
Обновить данные сотрудника.

**Request Body:** (all fields optional)
```json
{
  "fullName": "string",
  "age": number,
  "departmentId": "string",
  "hourlyRate": number,
  "hireDate": "string"
}
```

**Response:** Updated employee object.

### DELETE /employees/:id
Удалить сотрудника.

**Response:** Status 204 No Content.

---

## Подразделения (Departments)

### GET /departments
Получить список всех подразделений.

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "parentDepartmentId": "string | null"
  }
]
```

### GET /departments/:id
Получить данные подразделения с вложенными подразделениями и сотрудниками.

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "parentDepartmentId": "string | null",
  "children": ["Department[]"],
  "employees": ["Employee[]"]
}
```

### POST /departments
Создать новое подразделение.

**Request Body:**
```json
{
  "name": "string (required)",
  "parentDepartmentId": "string (optional)"
}
```

**Response:** Created department object with status 201.

### PUT /departments/:id
Обновить подразделение.

**Request Body:**
```json
{
  "name": "string",
  "parentDepartmentId": "string | null"
}
```

**Response:** Updated department object.

### DELETE /departments/:id
Удалить подразделение.

**Response:** Status 204 No Content.

---

## Табель (Timesheet Entries)

### GET /timesheet
Получить записи табеля за указанный период.

**Query Parameters:**
- `year` (number, required)
- `month` (number, required, 0-11)
- `employeeId` (string, optional)

**Response:**
```json
[
  {
    "employeeId": "string",
    "date": "YYYY-MM-DD",
    "hours": number,
    "type": "Я | Б | О | К | Н | ''"
  }
]
```

### POST /timesheet/entry
Создать или обновить запись в табеле.

**Request Body:**
```json
{
  "employeeId": "string (required)",
  "date": "string (required, format: YYYY-MM-DD)",
  "hours": "number (required, min: 0, max: 24)",
  "type": "string (required, enum: Я, Б, О, К, Н, '')"
}
```

**Response:** Created/updated entry object.

### DELETE /timesheet/entry/:employeeId/:date
Удалить запись из табеля.

**Response:** Status 204 No Content.

---

## Выплаты (Payments)

### GET /payments
Получить список выплат.

**Query Parameters:**
- `year` (number, required)
- `month` (number, required, 0-11)
- `employeeId` (string, optional)

**Response:**
```json
[
  {
    "id": "string",
    "employeeId": "string",
    "month": number,
    "year": number,
    "amountDue": number,
    "amountPaid": number,
    "paymentMethod": "transfer | cash",
    "paymentDate": "YYYY-MM-DD | null"
  }
]
```

### GET /payments/summary
Получить сводку по выплатам за месяц.

**Query Parameters:**
- `year` (number, required)
- `month` (number, required, 0-11)

**Response:**
```json
{
  "totalDue": number,
  "totalPaid": number,
  "totalRemaining": number,
  "employees": [
    {
      "employeeId": "string",
      "fullName": "string",
      "hoursWorked": number,
      "salary": number,
      "paid": number,
      "due": number
    }
  ]
}
```

### POST /payments
Зафиксировать выплату сотруднику.

**Request Body:**
```json
{
  "employeeId": "string (required)",
  "month": "number (required, 0-11)",
  "year": "number (required)",
  "amountDue": "number (required)",
  "amountPaid": "number (required, min: 0)",
  "paymentMethod": "string (required, enum: transfer, cash)",
  "paymentDate": "string (optional, format: YYYY-MM-DD)"
}
```

**Response:** Created payment object with status 201.

### DELETE /payments/:id
Удалить запись о выплате.

**Response:** Status 204 No Content.

---

## Отчеты (Reports)

### GET /reports/salary
Получить отчет по зарплате за период.

**Query Parameters:**
- `year` (number, required)
- `month` (number, required, 0-11)
- `departmentId` (string, optional)

**Response:**
```json
{
  "period": "YYYY-MM",
  "totalEmployees": number,
  "totalHours": number,
  "totalSalary": number,
  "byDepartment": [
    {
      "departmentId": "string",
      "departmentName": "string",
      "employeesCount": number,
      "totalHours": number,
      "totalSalary": number
    }
  ]
}
```

---

## Error Responses

Все ошибки возвращаются в формате:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` — ошибка валидации данных (400)
- `NOT_FOUND` — ресурс не найден (404)
- `CONFLICT` — конфликт данных (409)
- `INTERNAL_ERROR` — внутренняя ошибка сервера (500)
