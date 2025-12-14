# API Documentation - Tablas Gym Backend

## Base URL
```
http://localhost:3000/api
```

## Autenticación
Actualmente no se requiere autenticación.

---

## Endpoints

### Categories

#### 1. Obtener todas las categorías
```http
GET /api/categories
```

**Respuesta exitosa (200)**
```json
[
  {
    "_id": "6756a1b2c3d4e5f678901234",
    "name": "Brazos",
    "color": "#FF5733",
    "createdAt": "2025-12-13T10:30:00.000Z",
    "updatedAt": "2025-12-13T10:30:00.000Z"
  },
  {
    "_id": "6756a1b2c3d4e5f678901235",
    "name": "Espalda",
    "color": "#3498DB",
    "createdAt": "2025-12-13T10:30:00.000Z",
    "updatedAt": "2025-12-13T10:30:00.000Z"
  }
]
```

**Nota:** Las categorías se ordenan alfabéticamente por nombre.

---

#### 2. Obtener categoría por ID
```http
GET /api/categories/:id
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB de la categoría

**Ejemplo**
```http
GET /api/categories/6756a1b2c3d4e5f678901234
```

**Respuesta exitosa (200)**
```json
{
  "_id": "6756a1b2c3d4e5f678901234",
  "name": "Espalda",
  "color": "#3498DB",
  "createdAt": "2025-12-13T10:30:00.000Z",
  "updatedAt": "2025-12-13T10:30:00.000Z"
}
```

**Respuesta error (404)**
```json
{
  "error": "Categoría no encontrada"
}
```

---

#### 3. Crear categoría
```http
POST /api/categories
```

**Body (JSON)**
```json
{
  "name": "Abdominales",
  "color": "#E74C3C"
}
```

**Campos requeridos**
- `name` (string) - Nombre de la categoría

**Campos opcionales**
- `color` (string, máx 20 caracteres) - Color de la categoría

**Respuesta exitosa (201)**
```json
{
  "_id": "6756a1b2c3d4e5f678901239",
  "name": "Abdominales",
  "color": "#E74C3C",
  "createdAt": "2025-12-13T11:00:00.000Z",
  "updatedAt": "2025-12-13T11:00:00.000Z"
}
```

**Respuesta error (400)**
```json
{
  "error": "El nombre es requerido"
}
```

---

#### 4. Actualizar categoría
```http
PUT /api/categories/:id
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB de la categoría

**Body (JSON)**
```json
{
  "name": "Espalda Superior",
  "color": "#2ECC71"
}
```

**Campos opcionales**
- `name` (string) - Nuevo nombre de la categoría
- `color` (string, máx 20 caracteres) - Nuevo color de la categoría

**Nota:** Al menos uno de los campos debe ser proporcionado.

**Respuesta exitosa (200)**
```json
{
  "_id": "6756a1b2c3d4e5f678901234",
  "name": "Espalda Superior",
  "color": "#2ECC71",
  "createdAt": "2025-12-13T10:30:00.000Z",
  "updatedAt": "2025-12-13T11:15:00.000Z"
}
```

**Respuesta error (404)**
```json
{
  "error": "Categoría no encontrada"
}
```

---

#### 5. Eliminar categoría
```http
DELETE /api/categories/:id
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB de la categoría

**Respuesta exitosa (200)**
```json
{
  "message": "Categoría eliminada correctamente",
  "category": {
    "_id": "6756a1b2c3d4e5f678901234",
    "name": "Espalda"
  }
}
```

**Respuesta error (404)**
```json
{
  "error": "Categoría no encontrada"
}
```

---

#### 6. Eliminar ejercicios de una categoría
```http
DELETE /api/categories/:id/exercises
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB de la categoría

**Descripción**
Elimina todos los ejercicios asociados a una categoría específica.

**Ejemplo**
```http
DELETE /api/categories/6756a1b2c3d4e5f678901234/exercises
```

**Respuesta exitosa (200)**
```json
{
  "message": "Se eliminaron 3 ejercicio(s) de la categoría Espalda",
  "deletedCount": 3,
  "category": {
    "_id": "6756a1b2c3d4e5f678901234",
    "name": "Espalda"
  }
}
```

**Respuesta error (404)**
```json
{
  "error": "Categoría no encontrada"
}
```

**Respuesta error (404)**
```json
{
  "error": "Categoría no encontrada"
}
```

---

### Exercises

#### 1. Obtener todos los ejercicios
```http
GET /api/exercises
```

**Respuesta exitosa (200)**
```json
[
  {
    "_id": "6756b2c3d4e5f678901240",
    "name": "Dominadas",
    "categoryId": "6756a1b2c3d4e5f678901234",
    "createdAt": "2025-12-13T10:35:00.000Z",
    "updatedAt": "2025-12-13T10:35:00.000Z"
  },
  {
    "_id": "6756b2c3d4e5f678901241",
    "name": "Press de banca",
    "categoryId": "6756a1b2c3d4e5f678901235",
    "createdAt": "2025-12-13T10:35:00.000Z",
    "updatedAt": "2025-12-13T10:35:00.000Z"
  }
]
```

**Nota:** Los ejercicios se ordenan alfabéticamente por nombre.

---

#### 2. Obtener ejercicios por categoría
```http
GET /api/exercises/category/:categoryId
```

**Parámetros**
- `categoryId` (ObjectId, path) - _id de MongoDB de la categoría

**Ejemplo**
```http
GET /api/exercises/category/6756a1b2c3d4e5f678901234
```

**Respuesta exitosa (200)**
```json
[
  {
    "_id": "6756b2c3d4e5f678901240",
    "name": "Dominadas",
    "categoryId": "6756a1b2c3d4e5f678901234",
    "createdAt": "2025-12-13T10:35:00.000Z",
    "updatedAt": "2025-12-13T10:35:00.000Z"
  },
  {
    "_id": "6756b2c3d4e5f678901242",
    "name": "Remo con barra",
    "categoryId": "6756a1b2c3d4e5f678901234",
    "createdAt": "2025-12-13T10:35:00.000Z",
    "updatedAt": "2025-12-13T10:35:00.000Z"
  }
]
```

---

#### 3. Obtener ejercicio por ID
```http
GET /api/exercises/:id
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB del ejercicio

**Ejemplo**
```http
GET /api/exercises/6756b2c3d4e5f678901240
```

**Respuesta exitosa (200)**
```json
{
  "_id": "6756b2c3d4e5f678901240",
  "name": "Dominadas",
  "categoryId": "6756a1b2c3d4e5f678901234",
  "createdAt": "2025-12-13T10:35:00.000Z",
  "updatedAt": "2025-12-13T10:35:00.000Z"
}
```

**Respuesta error (404)**
```json
{
  "error": "Ejercicio no encontrado"
}
```

---

#### 4. Crear ejercicio
```http
POST /api/exercises
```

**Body (JSON)**
```json
{
  "name": "Sentadilla búlgara",
  "categoryId": "6756a1b2c3d4e5f678901236"
}
```

**Campos requeridos**
- `name` (string, 1-200 caracteres) - Nombre del ejercicio
- `categoryId` (ObjectId) - _id de MongoDB de la categoría existente

**Respuesta exitosa (201)**
```json
{
  "_id": "6756b2c3d4e5f678901250",
  "name": "Sentadilla búlgara",
  "categoryId": "6756a1b2c3d4e5f678901236",
  "createdAt": "2025-12-13T11:20:00.000Z",
  "updatedAt": "2025-12-13T11:20:00.000Z"
}
```

**Respuesta error (400)**
```json
{
  "error": "Nombre y categoryId son requeridos"
}
```
```json
{
  "error": "La categoría especificada no existe"
}
```

---

#### 5. Actualizar ejercicio
```http
PUT /api/exercises/:id
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB del ejercicio

**Body (JSON)**
```json
{
  "name": "Dominadas australianas",
  "categoryId": "6756a1b2c3d4e5f678901234"
}
```

**Campos opcionales**
- `name` (string, 1-200 caracteres) - Nuevo nombre del ejercicio
- `categoryId` (ObjectId) - Nuevo _id de categoría

**Nota:** Al menos uno de los campos debe ser proporcionado.

**Respuesta exitosa (200)**
```json
{
  "_id": "6756b2c3d4e5f678901240",
  "name": "Dominadas australianas",
  "categoryId": "6756a1b2c3d4e5f678901234",
  "createdAt": "2025-12-13T10:35:00.000Z",
  "updatedAt": "2025-12-13T11:25:00.000Z"
}
```

**Respuesta error (400)**
```json
{
  "error": "Debe proporcionar al menos un campo para actualizar"
}
```
```json
{
  "error": "La categoría especificada no existe"
}
```

**Respuesta error (404)**
```json
{
  "error": "Ejercicio no encontrado"
}
```

---

#### 6. Eliminar ejercicio
```http
DELETE /api/exercises/:id
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB del ejercicio

**Ejemplo**
```http
DELETE /api/exercises/6756b2c3d4e5f678901240
```

**Respuesta exitosa (200)**
```json
{
  "message": "Ejercicio eliminado correctamente",
  "exercise": {
    "_id": "6756b2c3d4e5f678901240",
    "name": "Dominadas",
    "categoryId": "6756a1b2c3d4e5f678901234"
  }
}
```

**Respuesta error (404)**
```json
{
  "error": "Ejercicio no encontrado"
}
```

---

### Tables

#### 1. Obtener todas las tablas
```http
GET /api/tables
```

**Respuesta exitosa (200)**
```json
[
  {
    "_id": "6756c1d2e3f4a5b678901250",
    "name": "Rutina Fullbody",
    "description": "Rutina completa de cuerpo entero",
    "exercises": [
      {
        "exerciseId": "6756b2c3d4e5f678901240",
        "order": 0,
        "name": "Dominadas",
        "color": "#FF5733",
        "categoryId": "6756a1b2c3d4e5f678901234"
      },
      {
        "exerciseId": "6756b2c3d4e5f678901241",
        "order": 1,
        "name": "Press Banca",
        "color": "#3498DB",
        "categoryId": "6756a1b2c3d4e5f678901235"
      }
    ],
    "createdAt": "2025-12-13T12:00:00.000Z",
    "updatedAt": "2025-12-13T12:00:00.000Z"
  }
]
```

**Nota:** Las tablas se ordenan alfabéticamente por nombre.

---

#### 2. Obtener tabla por ID
```http
GET /api/tables/:id
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB de la tabla

**Ejemplo**
```http
GET /api/tables/6756c1d2e3f4a5b678901250
```

**Respuesta exitosa (200)**
```json
{
  "_id": "6756c1d2e3f4a5b678901250",
  "name": "Rutina Fullbody",
  "description": "Rutina completa de cuerpo entero",
  "exercises": [
    {
      "exerciseId": {
        "_id": "6756b2c3d4e5f678901240",
        "name": "Dominadas",
        "categoryId": "6756a1b2c3d4e5f678901234"
      },
      "order": 0,
      "name": "Dominadas",
      "color": "#FF5733",
      "categoryId": "6756a1b2c3d4e5f678901234"
    }
  ],
  "createdAt": "2025-12-13T12:00:00.000Z",
  "updatedAt": "2025-12-13T12:00:00.000Z"
}
```

**Nota:** Los ejercicios se pueblan (populate) con sus datos completos.

**Respuesta error (404)**
```json
{
  "error": "Tabla no encontrada"
}
```

---

#### 3. Crear tabla
```http
POST /api/tables
```

**Body (JSON)**
```json
{
  "name": "Rutina Push",
  "description": "Ejercicios de empuje",
  "exercises": [
    {
      "exerciseId": "6756b2c3d4e5f678901241",
      "order": 0,
      "name": "Press Banca",
      "color": "#3498DB",
      "categoryId": "6756a1b2c3d4e5f678901235"
    },
    {
      "exerciseId": "6756b2c3d4e5f678901242",
      "order": 1,
      "name": "Press Militar",
      "color": "#E74C3C",
      "categoryId": "6756a1b2c3d4e5f678901235"
    }
  ]
}
```

**Campos requeridos**
- `name` (string, 1-200 caracteres) - Nombre de la tabla

**Campos opcionales**
- `description` (string, máx 500 caracteres) - Descripción
- `exercises` (array) - Array de ejercicios, cada uno con:
  - `exerciseId` (ObjectId, requerido) - ID del ejercicio
  - `order` (number, requerido) - Orden del ejercicio (≥0)
  - `name` (string, opcional, 1-200 caracteres) - Nombre del ejercicio
  - `color` (string, opcional, máx 20 caracteres) - Color de la fuente
  - `categoryId` (ObjectId, opcional) - ID de la categoría

**Respuesta exitosa (201)**
```json
{
  "_id": "6756c1d2e3f4a5b678901251",
  "name": "Rutina Push",
  "description": "Ejercicios de empuje",
  "exercises": [
    {
      "exerciseId": "6756b2c3d4e5f678901241",
      "order": 0,
      "name": "Press Banca",
      "color": "#3498DB",
      "categoryId": "6756a1b2c3d4e5f678901235"
    },
    {
      "exerciseId": "6756b2c3d4e5f678901242",
      "order": 1,
      "name": "Press Militar",
      "color": "#E74C3C",
      "categoryId": "6756a1b2c3d4e5f678901235"
    }
  ],
  "createdAt": "2025-12-13T13:00:00.000Z",
  "updatedAt": "2025-12-13T13:00:00.000Z"
}
```

**Respuesta error (400)**
```json
{
  "error": "El nombre es requerido"
}
```
```json
{
  "error": "Cada ejercicio debe tener exerciseId y order"
}
```
```json
{
  "error": "El ejercicio con ID 6756b2c3d4e5f678901999 no existe"
}
```

---

#### 4. Actualizar tabla
```http
PUT /api/tables/:id
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB de la tabla

**Body (JSON)**
```json
{
  "name": "Rutina Push Avanzada",
  "description": "Ejercicios de empuje para nivel avanzado",
  "exercises": [
    {
      "exerciseId": "6756b2c3d4e5f678901241",
      "order": 0,
      "name": "Press Banca",
      "color": "#2ECC71",
      "categoryId": "6756a1b2c3d4e5f678901235"
    }
  ]
}
```

**Campos opcionales**
- `name` (string, 1-200 caracteres)
- `description` (string, máx 500 caracteres)
- `exercises` (array)

**Nota:** Al menos uno de los campos debe ser proporcionado.

**Respuesta exitosa (200)**
```json
{
  "_id": "6756c1d2e3f4a5b678901250",
  "name": "Rutina Push Avanzada",
  "description": "Ejercicios de empuje para nivel avanzado",
  "exercises": [
    {
      "exerciseId": "6756b2c3d4e5f678901241",
      "order": 0,
      "name": "Press Banca",
      "color": "#2ECC71",
      "categoryId": "6756a1b2c3d4e5f678901235"
    }
  ],
  "createdAt": "2025-12-13T12:00:00.000Z",
  "updatedAt": "2025-12-13T13:30:00.000Z"
}
```

**Respuesta error (400)**
```json
{
  "error": "Debe proporcionar al menos un campo para actualizar"
}
```

**Respuesta error (404)**
```json
{
  "error": "Tabla no encontrada"
}
```

---

#### 5. Eliminar tabla
```http
DELETE /api/tables/:id
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB de la tabla

**Respuesta exitosa (200)**
```json
{
  "message": "Tabla eliminada correctamente",
  "table": {
    "_id": "6756c1d2e3f4a5b678901250",
    "name": "Rutina Fullbody",
    "exercises": []
  }
}
```

**Respuesta error (404)**
```json
{
  "error": "Tabla no encontrada"
}
```

---

#### 6. Agregar ejercicio a una tabla
```http
POST /api/tables/:id/exercises
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB de la tabla

**Body (JSON)**
```json
{
  "exerciseId": "6756b2c3d4e5f678901243",
  "order": 2,
  "name": "Sentadillas",
  "color": "#9B59B6",
  "categoryId": "6756a1b2c3d4e5f678901236"
}
```

**Campos requeridos**
- `exerciseId` (ObjectId) - ID del ejercicio a agregar
- `order` (number) - Orden del ejercicio (≥0)

**Campos opcionales**
- `name` (string, 1-200 caracteres) - Nombre del ejercicio
- `color` (string, máx 20 caracteres) - Color de la fuente
- `categoryId` (ObjectId) - ID de la categoría

**Respuesta exitosa (200)**
```json
{
  "_id": "6756c1d2e3f4a5b678901250",
  "name": "Rutina Fullbody",
  "exercises": [
    {
      "exerciseId": "6756b2c3d4e5f678901240",
      "order": 0,
      "name": "Dominadas",
      "color": "#FF5733",
      "categoryId": "6756a1b2c3d4e5f678901234"
    },
    {
      "exerciseId": "6756b2c3d4e5f678901243",
      "order": 2,
      "name": "Sentadillas",
      "color": "#9B59B6",
      "categoryId": "6756a1b2c3d4e5f678901236"
    }
  ],
  "createdAt": "2025-12-13T12:00:00.000Z",
  "updatedAt": "2025-12-13T14:00:00.000Z"
}
```

**Respuesta error (400)**
```json
{
  "error": "exerciseId y order son requeridos"
}
```
```json
{
  "error": "El ejercicio no existe"
}
```

**Respuesta error (404)**
```json
{
  "error": "Tabla no encontrada"
}
```

---

#### 7. Eliminar ejercicio de una tabla
```http
DELETE /api/tables/:id/exercises/:exerciseId
```

**Parámetros**
- `id` (ObjectId, path) - _id de MongoDB de la tabla
- `exerciseId` (ObjectId, path) - _id del ejercicio a eliminar

**Ejemplo**
```http
DELETE /api/tables/6756c1d2e3f4a5b678901250/exercises/6756b2c3d4e5f678901240
```

**Respuesta exitosa (200)**
```json
{
  "_id": "6756c1d2e3f4a5b678901250",
  "name": "Rutina Fullbody",
  "exercises": [
    {
      "exerciseId": "6756b2c3d4e5f678901243",
      "order": 2,
      "name": "Sentadillas",
      "color": "#9B59B6",
      "categoryId": "6756a1b2c3d4e5f678901236"
    }
  ],
  "createdAt": "2025-12-13T12:00:00.000Z",
  "updatedAt": "2025-12-13T14:30:00.000Z"
}
```

**Respuesta error (404)**
```json
{
  "error": "Tabla no encontrada"
}
```

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos o faltantes |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## Modelos de Datos

### Category
```typescript
{
  _id: ObjectId,          // Generado automáticamente por MongoDB
  name: string,           // Nombre de la categoría
  color?: string,         // Color de la categoría (opcional, máx 20 caracteres)
  createdAt: Date,        // Fecha de creación
  updatedAt: Date         // Fecha de última actualización
}
```

### Exercise
```typescript
{
  _id: ObjectId,          // Generado automáticamente por MongoDB
  name: string,           // Nombre del ejercicio (1-200 caracteres)
  categoryId: ObjectId,   // Referencia al _id de Category
  createdAt: Date,        // Fecha de creación
  updatedAt: Date         // Fecha de última actualización
}
```

### Table
```typescript
{
  _id: ObjectId,          // Generado automáticamente por MongoDB
  name: string,           // Nombre de la tabla (1-200 caracteres)
  description?: string,   // Descripción opcional (máx 500 caracteres)
  exercises: [{           // Array de ejercicios
    exerciseId: ObjectId, // Referencia al _id de Exercise
    order: number,        // Orden del ejercicio (≥0)
    name?: string,        // Nombre del ejercicio (1-200 caracteres)
    color?: string,       // Color de la fuente heredado de categorías (máx 20 caracteres)
    categoryId?: ObjectId // Referencia opcional al _id de Category
  }],
  createdAt: Date,        // Fecha de creación
  updatedAt: Date         // Fecha de última actualización
}
```

---

## Ejemplos de Uso

### JavaScript/TypeScript (Fetch API)

```javascript
// Obtener todas las categorías
const getCategories = async () => {
  const response = await fetch('http://localhost:3000/api/categories');
  const categories = await response.json();
  return categories;
};

// Crear un ejercicio
const createExercise = async () => {
  const response = await fetch('http://localhost:3000/api/exercises', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Press militar',
      categoryId: '6756a1b2c3d4e5f678901237'
    })
  });
  const exercise = await response.json();
  return exercise;
};

// Obtener ejercicios por categoría
const getExercisesByCategory = async (categoryId) => {
  const response = await fetch(`http://localhost:3000/api/exercises/category/${categoryId}`);
  const exercises = await response.json();
  return exercises;
};

// Crear tabla
const createTable = async () => {
  const response = await fetch('http://localhost:3000/api/tables', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Rutina Fullbody',
      description: 'Rutina completa',
      exercises: [
        { exerciseId: '6756b2c3d4e5f678901240', order: 0, name: 'Dominadas', color: '#FF5733', categoryId: '6756a1b2c3d4e5f678901234' },
        { exerciseId: '6756b2c3d4e5f678901241', order: 1, name: 'Press Banca', color: '#3498DB', categoryId: '6756a1b2c3d4e5f678901235' }
      ]
    })
  });
  const table = await response.json();
  return table;
};

// Agregar ejercicio a tabla existente
const addExerciseToTable = async (tableId) => {
  const response = await fetch(`http://localhost:3000/api/tables/${tableId}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      exerciseId: '6756b2c3d4e5f678901242',
      order: 2,
      name: 'Sentadillas',
      color: '#E74C3C',
      categoryId: '6756a1b2c3d4e5f678901236'
    })
  });
  const table = await response.json();
  return table;
};
```

### cURL

```bash
# Obtener todas las categorías
curl -X GET http://localhost:3000/api/categories

# Crear categoría
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Cardio", "color": "#9B59B6"}'

# Crear ejercicio
curl -X POST http://localhost:3000/api/exercises \
  -H "Content-Type: application/json" \
  -d '{"name": "Burpees", "categoryId": "6756a1b2c3d4e5f678901236"}'

# Crear tabla
curl -X POST http://localhost:3000/api/tables \
  -H "Content-Type: application/json" \
  -d '{"name": "Rutina A", "exercises": [{"exerciseId": "6756b2c3d4e5f678901240", "order": 0, "name": "Dominadas", "color": "#FF5733", "categoryId": "6756a1b2c3d4e5f678901234"}]}'

# Agregar ejercicio a tabla
curl -X POST http://localhost:3000/api/tables/6756c1d2e3f4a5b678901250/exercises \
  -H "Content-Type: application/json" \
  -d '{"exerciseId": "6756b2c3d4e5f678901241", "order": 1, "name": "Press Banca", "color": "#3498DB", "categoryId": "6756a1b2c3d4e5f678901235"}'

# Eliminar ejercicios de una categoría
curl -X DELETE http://localhost:3000/api/categories/6756a1b2c3d4e5f678901234/exercises

# Actualizar ejercicio
curl -X PUT http://localhost:3000/api/exercises/6756b2c3d4e5f678901240 \
  -H "Content-Type: application/json" \
  -d '{"name": "Dominadas supinas"}'

# Eliminar ejercicio de tabla
curl -X DELETE http://localhost:3000/api/tables/6756c1d2e3f4a5b678901250/exercises/6756b2c3d4e5f678901240
```

---

## Notas Importantes

1. **Identificadores:**
   - Todas las colecciones usan únicamente `_id` (ObjectId de MongoDB) como identificador
   - No hay campos `id` numéricos

2. **Referencias:**
   - `categoryId` en ejercicios debe corresponder al `_id` de una categoría existente

3. **CORS:**
   - La API acepta peticiones desde cualquier origen

4. **Validaciones:**
   - Los nombres de ejercicios deben tener entre 1 y 200 caracteres
   - Todos los campos marcados como requeridos deben estar presentes

5. **Ordenamiento:**
   - Las categorías se ordenan alfabéticamente por `name`
   - Los ejercicios se ordenan alfabéticamente por `name`
   - Las tablas se ordenan alfabéticamente por `name`

6. **Populate en Tablas:**
   - Al obtener una tabla por ID (`GET /api/tables/:id`), los ejercicios se pueblan automáticamente con sus datos completos
