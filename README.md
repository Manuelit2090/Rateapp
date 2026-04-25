# 🔥 Firebase Setup Guide - RateApp

## 📚 Explicación Completa de la Configuración de Firebase

Esta guía explica paso a paso cómo está configurado Firebase en tu proyecto RateApp, qué hace cada archivo y cómo usar todo el sistema.

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│              TU NAVEGADOR (Cliente)                 │
│  ┌──────────────────────────────────────────────┐   │
│  │ firebase-test.astro (Página)                │   │
│  │  └─> FirebaseTest.vue (Componente Vue)      │   │
│  │      └─> initializeFirebase()               │   │
│  │          (desde connectiodb.js)             │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                      ↓↑
┌─────────────────────────────────────────────────────┐
│           SERVIDOR ASTRO (Servidor)                 │
│  ┌──────────────────────────────────────────────┐   │
│  │ .env / .env.local (Variables de entorno)    │   │
│  │  └─> Lee: import.meta.env.VITE_FIREBASE_*  │   │
│  │      └─> Inyecta en window.firebaseConfig  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                      ↓↑
┌─────────────────────────────────────────────────────┐
│             FIREBASE (Nube - Google)                │
│  ┌──────────────────────────────────────────────┐   │
│  │ connectiodb.js → Autenticación               │   │
│  │ firebaseAuth.js → Login/Registro             │   │
│  │ firebaseQueries.js → Base de Datos           │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

```
RateApp/
├── .env                    # Variables de entorno (desarrollo)
├── .env.local             # Variables de entorno (local - NO subir a git)
├── README.md              # Esta guía completa
├── FIREBASE_SETUP.md      # Guía adicional
├── firebase.json          # Configuración Firebase Hosting
├── firestore.indexes.json # Índices de Firestore
├── firestore.rules        # Reglas de seguridad Firestore
├── package.json           # Dependencias (firebase: ^12.12.0)
├── src/
│   ├── components/
│   │   └── FirebaseTest.vue    # Componente de prueba
│   ├── modules/
│   │   └── connection/
│   │       ├── connectiodb.js      # Centro de control Firebase
│   │       ├── firebaseAuth.js     # Autenticación de usuarios
│   │       ├── firebaseQueries.js  # Operaciones de base de datos
│   │       └── README.md           # Documentación de módulos
│   └── pages/
│       └── firebase-test.astro     # Página de prueba
└── tsconfig.json          # Configuración TypeScript
```

---

## 🔧 Archivos de Configuración

### 1️⃣ **`.env` y `.env.local`** - Variables de Entorno

**Ubicación:** Raíz del proyecto
**Propósito:** Guardar credenciales de Firebase de forma segura

```env
# .env.local (NO subir a git)
VITE_FIREBASE_API_KEY=AIzaSyBTiRbexkqYWaJBOcCFZ8JgsDtVLLZ2k1c
VITE_FIREBASE_AUTH_DOMAIN=rateapp-58af0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rateapp-58af0
VITE_FIREBASE_STORAGE_BUCKET=rateapp-58af0.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=406145919627
VITE_FIREBASE_APP_ID=1:406145919627:web:f4b72b6ce05226918ac28e
VITE_FIREBASE_DATABASE_URL=https://rateapp-58af0.firebaseio.com
```

**¿Por qué dos archivos?**
- `.env` → Para desarrollo general
- `.env.local` → Para configuración local específica (tiene prioridad)

**¿Por qué `VITE_`?**
- Prefijo `VITE_` hace que las variables sean visibles en el navegador
- Astro las lee con `import.meta.env.VITE_FIREBASE_API_KEY`

**⚠️ SEGURIDAD:**
- `.env.local` está en `.gitignore` (NO se sube a GitHub)
- Nunca compartir credenciales públicas

---

### 2️⃣ **`firebase.json`** - Configuración de Firebase

**Ubicación:** Raíz del proyecto
**Propósito:** Configurar hosting y emuladores

```json
{
  "firestore": {
    "database": "(default)",
    "location": "southamerica-west1",
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": ["**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**¿Qué significa?**
- `firestore.database`: Base de datos por defecto
- `firestore.location`: Región de Sudamérica
- `hosting.public`: Carpeta `dist` para producción
- `hosting.rewrites`: SPA (Single Page Application)

---

### 3️⃣ **`firestore.rules`** - Reglas de Seguridad

**Ubicación:** Raíz del proyecto
**Propósito:** Controlar quién puede leer/escribir en Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas de seguridad aquí
    match /{document=**} {
      allow read, write: if true; // ⚠️ Solo para desarrollo
    }
  }
}
```

**⚠️ IMPORTANTE:**
- `allow read, write: if true` = TODOS pueden acceder (solo desarrollo)
- En producción: `allow read, write: if request.auth != null` (solo usuarios logueados)

---

## 📦 Módulos de Firebase

### 4️⃣ **`connectiodb.js`** - Centro de Control

**Ubicación:** `src/modules/connection/connectiodb.js`
**Propósito:** Inicializar y gestionar todas las conexiones de Firebase

```javascript
// Funciones principales
export function initializeFirebase()     // Inicia Firebase
export function getAuthInstance()        // Obtiene Auth
export function getFirestoreInstance()   // Obtiene Firestore
export function getStorageInstance()     // Obtiene Storage
export function getFirebaseServices()    // Obtiene todo
```

**¿Qué hace paso a paso?**

1. **Lee configuración:**
```javascript
const getFirebaseConfig = () => {
  // Primero intenta window.firebaseConfig (inyectado por Astro)
  if (typeof window !== 'undefined' && window.firebaseConfig) {
    return window.firebaseConfig;
  }
  // Fallback a import.meta.env
  return { apiKey: import.meta.env.VITE_FIREBASE_API_KEY, ... };
};
```

2. **Valida configuración:**
```javascript
function validateFirebaseConfig(config) {
  // Verifica que todas las claves requeridas existan
  // Muestra warning si faltan
}
```

3. **Inicializa servicios:**
```javascript
app = initializeApp(firebaseConfig);        // App principal
auth = getAuth(app);                        // Autenticación
db = getFirestore(app);                     // Base de datos
storage = getStorage(app);                  // Almacenamiento
```

**Ejemplo de uso:**
```javascript
import { initializeFirebase, getFirestoreInstance } from './connectiodb.js';

// Inicializar (una sola vez)
const services = initializeFirebase();

// Obtener servicios cuando necesites
const db = getFirestoreInstance();
const auth = getAuthInstance();
```

---

### 5️⃣ **`firebaseAuth.js`** - Autenticación de Usuarios

**Ubicación:** `src/modules/connection/firebaseAuth.js`
**Propósito:** Gestionar usuarios (login, registro, perfiles)

```javascript
// Funciones disponibles
export async function registerUser(email, password)     // Crear cuenta
export async function loginUser(email, password)        // Iniciar sesión
export async function logoutUser()                      // Cerrar sesión
export function getCurrentUser()                        // Usuario actual
export function subscribeToAuthState(callback)          // Escuchar cambios
export async function updateUserProfile(data)           // Actualizar perfil
export async function updateUserEmail(email)            // Cambiar email
export async function updateUserPassword(pass)          // Cambiar contraseña
export async function sendResetEmail(email)             // Recuperar contraseña
```

**Ejemplos de uso:**

```javascript
import { registerUser, loginUser, getCurrentUser } from './firebaseAuth.js';

// Registrar usuario
try {
  const user = await registerUser('juan@example.com', 'miPassword123');
  console.log('Usuario creado:', user.email);
} catch (error) {
  console.error('Error:', error.message);
}

// Iniciar sesión
const user = await loginUser('juan@example.com', 'miPassword123');

// Obtener usuario actual
const currentUser = getCurrentUser();
if (currentUser) {
  console.log('Usuario logueado:', currentUser.email);
}

// Escuchar cambios de autenticación
const unsubscribe = subscribeToAuthState((user) => {
  if (user) {
    console.log('Usuario autenticado:', user.email);
  } else {
    console.log('Usuario no autenticado');
  }
});

// Detener escucha
unsubscribe();
```

---

### 6️⃣ **`firebaseQueries.js`** - Base de Datos (Firestore)

**Ubicación:** `src/modules/connection/firebaseQueries.js`
**Propósito:** Operaciones CRUD en la base de datos

```javascript
// Funciones disponibles
export async function getDocumentById(collection, id)         // Obtener por ID
export async function getAllDocuments(collection, limit)      // Obtener todos
export async function queryDocuments(collection, conditions)  // Buscar con filtros
export async function createDocument(collection, data)        // Crear documento
export async function setDocument(collection, id, data)       // Guardar documento
export async function updateDocument(collection, id, data)    // Actualizar documento
export async function deleteDocument(collection, id)          // Eliminar documento
export function subscribeToDocument(collection, id, callback) // Escuchar cambios
```

**Ejemplos de uso:**

```javascript
import {
  createDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  queryDocuments
} from './firebaseQueries.js';

// Crear restaurante
const restauranteId = await createDocument('restaurantes', {
  nombre: 'Pizza Italia',
  ciudad: 'Madrid',
  calificacion: 4.5,
  tipo: 'italiana'
});

// Obtener todos los restaurantes
const todos = await getAllDocuments('restaurantes');

// Obtener con límite
const primeros10 = await getAllDocuments('restaurantes', 10);

// Buscar restaurantes italianos con buena calificación
const italianosBuenos = await queryDocuments('restaurantes', [
  ['tipo', '==', 'italiana'],
  ['calificacion', '>=', 4.0]
]);

// Actualizar calificación
await updateDocument('restaurantes', restauranteId, {
  calificacion: 4.8
});

// Eliminar restaurante
await deleteDocument('restaurantes', restauranteId);

// Escuchar cambios en tiempo real
const unsubscribe = subscribeToDocument('restaurantes', restauranteId, (doc) => {
  if (doc) {
    console.log('Restaurante actualizado:', doc.nombre);
  } else {
    console.log('Restaurante eliminado');
  }
});

// Detener escucha
unsubscribe();
```

---

## 🎨 Componentes de Interfaz

### 7️⃣ **`FirebaseTest.vue`** - Componente de Prueba

**Ubicación:** `src/components/FirebaseTest.vue`
**Propósito:** Probar que Firebase funciona correctamente

**Características:**
- ✅ Verifica configuración
- ✅ Muestra estado de servicios
- ✅ Prueba conexión a Firestore
- ✅ Muestra errores detallados

**Visual:**
```
🔧 Test Firebase
✅ Estado: Firebase conectado correctamente
✅ Auth: Disponible
✅ Firestore (db): Disponible
✅ Storage: Disponible
[🔄 Probar Firestore]
```

---

### 8️⃣ **`firebase-test.astro`** - Página de Prueba

**Ubicación:** `src/pages/firebase-test.astro`
**Propósito:** Página que inyecta configuración y muestra el test

**Flujo:**
1. **Servidor:** Lee `.env` y crea `firebaseConfig`
2. **HTML:** Inyecta config en `window.firebaseConfig`
3. **Cliente:** Componente Vue usa la config

---

## 🔄 Flujo Completo de Funcionamiento

### Cuando abres `http://localhost:3000/firebase-test`:

```
1. SERVIDOR ASTRO
   │
   ├─ Lee .env.local
   │  └─ VITE_FIREBASE_API_KEY=AIza...
   │
   ├─ Crea firebaseConfig
   │  └─ { apiKey: "AIza...", authDomain: "rateapp...", ... }
   │
   └─ Inyecta en HTML
      └─ <script>window.firebaseConfig = { ... }</script>

2. NAVEGADOR (Cliente)
   │
   ├─ Carga HTML
   │  └─ window.firebaseConfig ya existe ✅
   │
   ├─ Monta FirebaseTest.vue
   │  └─ Recibe config como prop
   │
   ├─ Ejecuta initTest()
   │  └─ window.firebaseConfig = props.config
   │  └─ initializeFirebase()
   │
   └─ Conecta a Firebase
      ├─ connectiodb.js lee window.firebaseConfig
      ├─ initializeApp(firebaseConfig)
      ├─ getAuth(), getFirestore(), getStorage()
      └─ ✅ Todo funciona
```

---

## 📊 Ejemplos Prácticos

### Guardar un Restaurante

```javascript
// 1. Inicializar Firebase (una sola vez en tu app)
import { initializeFirebase } from '@/modules/connection/connectiodb';
initializeFirebase();

// 2. Crear restaurante
import { createDocument } from '@/modules/connection/firebaseQueries';

const restauranteId = await createDocument('restaurantes', {
  nombre: 'Mcdonalds',
  ciudad: 'Madrid',
  calificacion: 4.2,
  tipo: 'fast-food',
  createdAt: new Date()
});

// 3. Obtener todos
const todos = await getAllDocuments('restaurantes');
console.log(todos);
// [{ id: 'abc123', nombre: 'Mcdonalds', ... }]
```

### Sistema de Login Completo

```javascript
// 1. Registrar usuario
import { registerUser } from '@/modules/connection/firebaseAuth';

const user = await registerUser('usuario@gmail.com', 'password123');

// 2. Login
const user = await loginUser('usuario@gmail.com', 'password123');

// 3. Obtener usuario actual
const currentUser = getCurrentUser();

// 4. Escuchar cambios de autenticación
subscribeToAuthState((user) => {
  if (user) {
    console.log('Usuario logueado:', user.email);
  } else {
    console.log('Usuario no logueado');
  }
});
```

### En Componentes Astro

```astro
---
import { getAllDocuments } from '@/modules/connection/firebaseQueries';
import { initializeFirebase } from '@/modules/connection/connectiodb';

// Inicializar (solo una vez)
initializeFirebase();

// Obtener datos
const restaurantes = await getAllDocuments('restaurantes');
---

<h1>Restaurantes: {restaurantes.length}</h1>
<ul>
  {restaurantes.map(r => (
    <li>{r.nombre} - {r.ciudad} ⭐{r.calificacion}</li>
  ))}
</ul>
```

### En Componentes Vue

```vue
<template>
  <div>
    <h1>Restaurantes</h1>
    <button @click="cargarDatos">Cargar</button>
    <ul v-if="restaurantes.length">
      <li v-for="r in restaurantes" :key="r.id">
        {{ r.nombre }} - {{ r.ciudad }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAllDocuments } from '@/modules/connection/firebaseQueries.js';

const restaurantes = ref([]);

async function cargarDatos() {
  restaurantes.value = await getAllDocuments('restaurantes');
}
</script>
```

---

## 🆘 Solución de Problemas

### ❌ "Config received: {apiKey: undefined, ...}"

**Causa:** Variables de entorno no cargadas
**Solución:**
```bash
# 1. Detener servidor (Ctrl+C)
# 2. Limpiar caché
rm -rf .astro
# 3. Reiniciar
npm run dev
# 4. Limpiar caché navegador (Ctrl+Shift+Delete)
```

### ❌ "Firebase not initialized"

**Causa:** No llamaste `initializeFirebase()`
**Solución:**
```javascript
import { initializeFirebase } from '@/modules/connection/connectiodb';
initializeFirebase(); // Llamar al inicio de tu app
```

### ❌ "does not exist" en Firestore

**Causa:** La colección no existe aún (normal)
**Solución:** Crear documentos primero
```javascript
await createDocument('restaurantes', { nombre: 'Test' });
```

### ❌ Errores de autenticación

**Causa:** No habilitaste métodos en Firebase Console
**Solución:**
1. Ir a Firebase Console > Authentication
2. Habilita "Email/Password"

---

## 📋 Checklist de Verificación

### ✅ Configuración Inicial
- [ ] `.env.local` tiene todas las credenciales
- [ ] `npm run dev` funciona sin errores
- [ ] `http://localhost:3000/firebase-test` muestra ✅

### ✅ Firebase Console
- [ ] Proyecto creado en Firebase
- [ ] Authentication > Email/Password habilitado
- [ ] Firestore > Base de datos creada
- [ ] Storage > Bucket creado (opcional)

### ✅ Código Funcional
- [ ] `initializeFirebase()` llamado al inicio
- [ ] Importaciones correctas: `@/modules/connection/...`
- [ ] Manejo de errores implementado

---

## 🚀 Próximos Pasos

1. **Completar credenciales** en `.env.local`
2. **Reiniciar servidor** y limpiar caché
3. **Probar** en `http://localhost:3000/firebase-test`
4. **Usar** en tus componentes reales
5. **Configurar reglas de seguridad** en producción

---

## 📖 Documentación Oficial

- [Firebase JS SDK](https://firebase.google.com/docs/web/setup)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Authentication](https://firebase.google.com/docs/auth)
- [Astro Docs](https://docs.astro.build)
- [Vue 3 Docs](https://vuejs.org)

---

**¡Tu configuración Firebase está completa y lista para usar! 🚀**

Cualquier duda, revisa los archivos en `src/modules/connection/` o abre `FIREBASE_SETUP.md`
