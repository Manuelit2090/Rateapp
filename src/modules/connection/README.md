# � Firebase Connection Modules - Documentación Completa

## 📚 Índice

- [🏗️ Arquitectura](#-arquitectura)
- [📁 Estructura de Archivos](#-estructura-de-archivos)
- [🔧 connectiodb.js - Centro de Control](#-connectiodbjs---centro-de-control)
- [🔐 firebaseAuth.js - Autenticación](#-firebaseauthjs---autenticación)
- [💾 firebaseQueries.js - Base de Datos](#-firebasequeriesjs---base-de-datos)
- [🎨 firebase-test.astro - Página de Prueba](#-firebase-testastro---página-de-prueba)
- [⚙️ Configuración](#️-configuración)
- [📊 Ejemplos de Uso](#-ejemplos-de-uso)
- [🆘 Solución de Problemas](#-solución-de-problemas)

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│              TU NAVEGADOR (Cliente)                 │
│  ┌──────────────────────────────────────────────┐   │
│  │ firebase-test.astro (Página)                │   │
│  │  └─> FirebaseTest.vue (Componente)          │   │
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
src/modules/connection/
├── README.md              # Esta documentación completa
├── connectiodb.js         # Centro de control Firebase
├── firebaseAuth.js        # Autenticación de usuarios
├── firebaseQueries.js     # Operaciones de base de datos
└── explicación.md         # Notas adicionales
```

---

## 🔧 connectiodb.js - Centro de Control

### 📋 Descripción
Archivo principal que inicializa y gestiona todas las conexiones de Firebase. Actúa como un centro de control que coordina Auth, Firestore y Storage.

### 🔧 Funciones Principales

#### `initializeFirebase()`
**Propósito:** Inicializa todos los servicios de Firebase
**Retorno:** `{ app, auth, db, storage }`
**Uso:**
```javascript
import { initializeFirebase } from '@/modules/connection/connectiodb';

// Inicializar (una sola vez en tu app)
const services = initializeFirebase();
console.log('Firebase inicializado:', services);
```

#### `getAuthInstance()`
**Propósito:** Obtiene la instancia de autenticación
**Retorno:** Instancia de Firebase Auth
```javascript
const auth = getAuthInstance();
```

#### `getFirestoreInstance()`
**Propósito:** Obtiene la instancia de Firestore
**Retorno:** Instancia de Firestore
```javascript
const db = getFirestoreInstance();
```

#### `getStorageInstance()`
**Propósito:** Obtiene la instancia de Storage
**Retorno:** Instancia de Firebase Storage
```javascript
const storage = getStorageInstance();
```

#### `getFirebaseServices()`
**Propósito:** Obtiene todas las instancias en un objeto
**Retorno:** `{ auth, db, storage }`
```javascript
const { auth, db, storage } = getFirebaseServices();
```

### 🔄 Flujo de Inicialización

```javascript
1. getFirebaseConfig() → Obtiene configuración
   ├── window.firebaseConfig (cliente)
   └── import.meta.env (servidor)

2. validateFirebaseConfig() → Valida configuración
   ├── Verifica claves requeridas
   └── Muestra warnings si faltan

3. initializeApp(firebaseConfig) → Inicializa app
4. getAuth(app) → Inicializa auth
5. getFirestore(app) → Inicializa Firestore
6. getStorage(app) → Inicializa Storage

7. isInitialized = true → Marca como listo
```

### ⚙️ Configuración Interna

#### `getFirebaseConfig()`
**Lógica de Prioridad:**
1. **Primero:** `window.firebaseConfig` (inyectado por Astro)
2. **Fallback:** `import.meta.env.VITE_FIREBASE_*`

**¿Por qué?**
- **Cliente:** No puede acceder a `import.meta.env` directamente
- **Servidor:** Lee `.env` y inyecta en `window`

#### `validateFirebaseConfig(config)`
**Valida:**
- `apiKey`, `authDomain`, `projectId`
- `storageBucket`, `messagingSenderId`, `appId`

**Acción:** Muestra warnings (no detiene ejecución)

---

## 🔐 firebaseAuth.js - Autenticación

### 📋 Descripción
Módulo completo para gestionar autenticación de usuarios con Firebase Auth.

### 👤 Funciones de Usuario

#### `registerUser(email, password)`
**Propósito:** Crear nueva cuenta de usuario
**Parámetros:**
- `email` (string): Email del usuario
- `password` (string): Contraseña
**Retorno:** `Promise<User>`
```javascript
const user = await registerUser('juan@example.com', 'password123');
console.log('Usuario creado:', user.email);
```

#### `loginUser(email, password)`
**Propósito:** Iniciar sesión
**Parámetros:**
- `email` (string): Email del usuario
- `password` (string): Contraseña
**Retorno:** `Promise<User>`
```javascript
const user = await loginUser('juan@example.com', 'password123');
console.log('Sesión iniciada:', user.email);
```

#### `logoutUser()`
**Propósito:** Cerrar sesión
**Retorno:** `Promise<void>`
```javascript
await logoutUser();
console.log('Sesión cerrada');
```

#### `getCurrentUser()`
**Propósito:** Obtener usuario actualmente autenticado
**Retorno:** `User | null`
```javascript
const user = getCurrentUser();
if (user) {
  console.log('Usuario actual:', user.email);
}
```

### 👂 Escuchadores en Tiempo Real

#### `subscribeToAuthState(callback)`
**Propósito:** Escuchar cambios en el estado de autenticación
**Parámetros:**
- `callback` (function): Función que recibe `(user)`
**Retorno:** `function` - Función para detener escucha
```javascript
const unsubscribe = subscribeToAuthState((user) => {
  if (user) {
    console.log('Usuario autenticado:', user.email);
  } else {
    console.log('Usuario NO autenticado');
  }
});

// Detener escucha
unsubscribe();
```

### 🔄 Gestión de Perfil

#### `updateUserProfile(profileData)`
**Propósito:** Actualizar perfil del usuario
**Parámetros:**
- `profileData` (object): `{ displayName?, photoURL? }`
**Retorno:** `Promise<void>`
```javascript
await updateUserProfile({
  displayName: 'Juan Pérez',
  photoURL: 'https://example.com/photo.jpg'
});
```

#### `updateUserEmail(newEmail)`
**Propósito:** Cambiar email del usuario
**Parámetros:**
- `newEmail` (string): Nuevo email
**Retorno:** `Promise<void>`
```javascript
await updateUserEmail('nuevo@email.com');
```

#### `updateUserPassword(newPassword)`
**Propósito:** Cambiar contraseña
**Parámetros:**
- `newPassword` (string): Nueva contraseña
**Retorno:** `Promise<void>`
```javascript
await updateUserPassword('nuevaPassword123');
```

### 🔑 Recuperación de Contraseña

#### `sendResetEmail(email)`
**Propósito:** Enviar email de recuperación
**Parámetros:**
- `email` (string): Email del usuario
**Retorno:** `Promise<void>`
```javascript
await sendResetEmail('usuario@example.com');
console.log('Email de recuperación enviado');
```

---

## 💾 firebaseQueries.js - Base de Datos

### 📋 Descripción
Módulo completo para operaciones CRUD en Firestore con funciones optimizadas.

### 📖 Operaciones de Lectura

#### `getDocumentById(collectionName, docId)`
**Propósito:** Obtener un documento específico por ID
**Parámetros:**
- `collectionName` (string): Nombre de la colección
- `docId` (string): ID del documento
**Retorno:** `Promise<Object | null>`
```javascript
const doc = await getDocumentById('usuarios', 'user123');
if (doc) {
  console.log('Usuario:', doc.nombre);
}
```

#### `getAllDocuments(collectionName, limitCount?)`
**Propósito:** Obtener todos los documentos de una colección
**Parámetros:**
- `collectionName` (string): Nombre de la colección
- `limitCount` (number, opcional): Límite de resultados
**Retorno:** `Promise<Array>`
```javascript
// Todos los documentos
const todos = await getAllDocuments('restaurantes');

// Con límite
const primeros10 = await getAllDocuments('restaurantes', 10);
```

#### `queryDocuments(collectionName, conditions, limitCount?)`
**Propósito:** Buscar documentos con filtros
**Parámetros:**
- `collectionName` (string): Nombre de la colección
- `conditions` (Array): Array de `[field, operator, value]`
- `limitCount` (number, opcional): Límite de resultados
**Retorno:** `Promise<Array>`
```javascript
// Restaurantes italianos con buena calificación
const italianos = await queryDocuments('restaurantes', [
  ['tipo', '==', 'italiana'],
  ['calificacion', '>=', 4.0]
]);

// Con límite
const top5 = await queryDocuments('restaurantes', [
  ['tipo', '==', 'italiana']
], 5);
```

### ✏️ Operaciones de Escritura

#### `createDocument(collectionName, data)`
**Propósito:** Crear nuevo documento
**Parámetros:**
- `collectionName` (string): Nombre de la colección
- `data` (object): Datos del documento
**Retorno:** `Promise<string>` - ID del nuevo documento
```javascript
const id = await createDocument('restaurantes', {
  nombre: 'Pizza Italia',
  ciudad: 'Madrid',
  calificacion: 4.5,
  tipo: 'italiana'
});
console.log('Restaurante creado con ID:', id);
```

#### `setDocument(collectionName, docId, data)`
**Propósito:** Crear/actualizar documento con ID específico
**Parámetros:**
- `collectionName` (string): Nombre de la colección
- `docId` (string): ID del documento
- `data` (object): Datos del documento
**Retorno:** `Promise<void>`
```javascript
await setDocument('usuarios', 'user123', {
  nombre: 'Juan',
  email: 'juan@example.com'
});
```

#### `updateDocument(collectionName, docId, data)`
**Propósito:** Actualizar campos específicos de un documento
**Parámetros:**
- `collectionName` (string): Nombre de la colección
- `docId` (string): ID del documento
- `data` (object): Campos a actualizar
**Retorno:** `Promise<void>`
```javascript
await updateDocument('restaurantes', 'rest123', {
  calificacion: 4.8,
  reseñas: 150
});
```

#### `deleteDocument(collectionName, docId)`
**Propósito:** Eliminar un documento
**Parámetros:**
- `collectionName` (string): Nombre de la colección
- `docId` (string): ID del documento
**Retorno:** `Promise<void>`
```javascript
await deleteDocument('restaurantes', 'rest123');
console.log('Restaurante eliminado');
```

### 👂 Escuchadores en Tiempo Real

#### `subscribeToDocument(collectionName, docId, callback)`
**Propósito:** Escuchar cambios en un documento específico
**Parámetros:**
- `collectionName` (string): Nombre de la colección
- `docId` (string): ID del documento
- `callback` (function): Función que recibe `(doc)`
**Retorno:** `function` - Función para detener escucha
```javascript
const unsubscribe = subscribeToDocument('restaurantes', 'rest123', (doc) => {
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

## 🎨 firebase-test.astro - Página de Prueba

### 📋 Descripción
Página de prueba que inyecta la configuración de Firebase y muestra el componente de test.

### 🔄 Flujo de Funcionamiento

```javascript
1. SERVIDOR ASTRO
   │
   ├─ Lee .env.local
   │  └─ VITE_FIREBASE_API_KEY=...
   │
   ├─ Crea firebaseConfig
   │  └─ { apiKey: "...", authDomain: "...", ... }
   │
   └─ Inyecta en HTML
      └─ <script>window.firebaseConfig = { ... }</script>

2. NAVEGADOR (Cliente)
   │
   ├─ Carga HTML
   │  └─ window.firebaseConfig disponible ✅
   │
   ├─ Monta FirebaseTest.vue
   │  └─ Recibe config como prop
   │
   ├─ Ejecuta initTest()
   │  └─ initializeFirebase()
   │
   └─ Conecta a Firebase
```

### 📝 Código Principal

```astro
---
// Obtener variables en el servidor
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... otras variables
};
---

<html>
  <body>
    <!-- Inyectar config en window -->
    <script define:vars={{ firebaseConfig }}>
      window.firebaseConfig = firebaseConfig;
    </script>

    <!-- Componente Vue con config -->
    <FirebaseTestComponent client:load config={firebaseConfig} />
  </body>
</html>
```

---

## ⚙️ Configuración

### 1️⃣ Variables de Entorno (.env.local)

```env
# Credenciales de Firebase
VITE_FIREBASE_API_KEY=AIzaSyBTiRbexkqYWaJBOcCFZ8JgsDtVLLZ2k1c
VITE_FIREBASE_AUTH_DOMAIN=rateapp-58af0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rateapp-58af0
VITE_FIREBASE_STORAGE_BUCKET=rateapp-58af0.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=406145919627
VITE_FIREBASE_APP_ID=1:406145919627:web:f4b72b6ce05226918ac28e
VITE_FIREBASE_DATABASE_URL=https://rateapp-58af0.firebaseio.com
```

### 2️⃣ Configuración de Astro (astro.config.mjs)

```javascript
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
```

### 3️⃣ Configuración de TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 📊 Ejemplos de Uso

### 🚀 Inicialización Básica

```javascript
// En tu layout.astro o página principal
import { initializeFirebase } from '@/modules/connection/connectiodb';

// Inicializar Firebase (una sola vez)
initializeFirebase();
```

### 👤 Sistema de Login Completo

```javascript
import {
  registerUser,
  loginUser,
  logoutUser,
  subscribeToAuthState,
  getCurrentUser
} from '@/modules/connection/firebaseAuth';

// Componente Vue
export default {
  data() {
    return {
      user: null,
      email: '',
      password: ''
    }
  },
  mounted() {
    // Escuchar cambios de autenticación
    subscribeToAuthState((user) => {
      this.user = user;
    });
  },
  methods: {
    async register() {
      try {
        await registerUser(this.email, this.password);
        console.log('Usuario registrado');
      } catch (error) {
        console.error('Error:', error.message);
      }
    },

    async login() {
      try {
        await loginUser(this.email, this.password);
        console.log('Sesión iniciada');
      } catch (error) {
        console.error('Error:', error.message);
      }
    },

    async logout() {
      await logoutUser();
      console.log('Sesión cerrada');
    }
  }
}
```

### 🍕 Gestión de Restaurantes

```javascript
import {
  createDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  queryDocuments
} from '@/modules/connection/firebaseQueries';

// Crear restaurante
const restauranteId = await createDocument('restaurantes', {
  nombre: 'Pizza Italia',
  ciudad: 'Madrid',
  calificacion: 4.5,
  tipo: 'italiana',
  precio: '$$',
  imagen: 'https://example.com/pizza.jpg'
});

// Obtener todos
const restaurantes = await getAllDocuments('restaurantes');

// Buscar por tipo
const italianos = await queryDocuments('restaurantes', [
  ['tipo', '==', 'italiana']
]);

// Actualizar calificación
await updateDocument('restaurantes', restauranteId, {
  calificacion: 4.8,
  reseñas: 150
});

// Eliminar
await deleteDocument('restaurantes', restauranteId);
```

### 🛒 Sistema de Cupones

```javascript
// Crear cupón
const cuponId = await createDocument('cupones', {
  titulo: 'Descuento 20%',
  descripcion: 'En pizzas italianas',
  descuento: 20,
  tipo: 'porcentaje',
  restauranteId: restauranteId,
  validoHasta: new Date('2024-12-31'),
  usosMaximos: 100,
  usosActuales: 0
});

// Obtener cupones activos
const cuponesActivos = await queryDocuments('cupones', [
  ['validoHasta', '>', new Date()],
  ['usosActuales', '<', 'usosMaximos']
]);
```

### 👤 Perfil de Usuario

```javascript
import { updateUserProfile, updateUserEmail } from '@/modules/connection/firebaseAuth';

// Actualizar perfil
await updateUserProfile({
  displayName: 'Juan Pérez',
  photoURL: 'https://example.com/avatar.jpg'
});

// Cambiar email
await updateUserEmail('nuevo@email.com');
```

---

## 🆘 Solución de Problemas

### ❌ "Config received: {apiKey: undefined, ...}"

**Causa:** Variables de entorno no cargadas
**Solución:**
```bash
# Detener servidor
# Limpiar caché
rm -rf .astro
# Reiniciar
npm run dev
```

### ❌ "Firebase not initialized"

**Causa:** No llamaste `initializeFirebase()`
**Solución:**
```javascript
import { initializeFirebase } from '@/modules/connection/connectiodb';
initializeFirebase(); // Al inicio de tu app
```

### ❌ "does not exist" en Firestore

**Causa:** La colección no existe aún
**Solución:** Crear documentos primero
```javascript
await createDocument('coleccion', { campo: 'valor' });
```

### ❌ Errores de autenticación

**Causa:** No habilitaste métodos en Firebase Console
**Solución:**
1. Firebase Console > Authentication
2. Habilitar "Email/Password"

### ❌ "Cannot read properties of undefined"

**Causa:** Intentando usar servicios antes de inicializar
**Solución:** Asegurar orden correcto
```javascript
// ✅ Correcto
initializeFirebase();
const db = getFirestoreInstance();

// ❌ Incorrecto
const db = getFirestoreInstance(); // undefined
initializeFirebase();
```

---

## 📈 Rendimiento y Mejores Prácticas

### ⚡ Inicialización
- Llama `initializeFirebase()` solo una vez
- Hazlo al inicio de tu aplicación
- Evita inicializaciones múltiples

### 🔍 Consultas
- Usa `limit()` para consultas grandes
- Implementa paginación para listas largas
- Usa índices compuestos para consultas complejas

### 👂 Escuchadores
- Siempre guarda la función `unsubscribe()`
- Detén escuchadores cuando no los necesites
- Evita escuchadores innecesarios

### 🔒 Seguridad
- Nunca expongas credenciales en el cliente
- Usa reglas de seguridad en producción
- Valida datos antes de enviar

---

## 📚 Referencias

- [Firebase JS SDK](https://firebase.google.com/docs/web/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Authentication Guide](https://firebase.google.com/docs/auth)
- [Astro Documentation](https://docs.astro.build)

---

**¡Tu sistema Firebase está completamente documentado y listo para usar! 🚀**

// Obtener documento por ID
const user = await getDocumentById('usuarios', id);

// Obtener todos los documentos
const users = await getAllDocuments('usuarios');

// Obtener todos con límite
const users = await getAllDocuments('usuarios', 10);

// Consultar con condiciones
const admins = await queryDocuments('usuarios', [
  ['rol', '==', 'admin']
], 5);

// Actualizar documento
await updateDocument('usuarios', id, { nombre: 'Juan Pérez' });

// Eliminar documento
await deleteDocument('usuarios', id);

// Escuchar cambios en tiempo real
const unsubscribe = subscribeToDocument('usuarios', id, (user) => {
  if (user) {
    console.log('Usuario actualizado:', user);
  }
});

// Dejar de escuchar
unsubscribe();
```

---

## 🎯 Ejemplo en componente Astro

```astro
---
import { initializeFirebase } from '@/modules/connection/connectiodb';
import { loginUser } from '@/modules/connection/firebaseAuth';

// Inicializa Firebase
initializeFirebase();
---

<script>
import { loginUser } from '@/modules/connection/firebaseAuth';

async function handleLogin() {
  try {
    const user = await loginUser('usuario@example.com', 'password123');
    console.log('Login exitoso:', user.email);
  } catch (error) {
    console.error('Error en login:', error.message);
  }
}

document.getElementById('loginBtn').addEventListener('click', handleLogin);
</script>

<button id="loginBtn">Iniciar Sesión</button>
```

---

## 🔒 Seguridad

- **Nunca** compartas tu `.env.local`
- Agrega `.env.local` a tu `.gitignore` (ya debería estarlo)
- Las variables de entorno se cargan automáticamente en Astro

---

## 🆘 Solución de problemas

❌ **"Invalid Firebase configuration"**
- Verifica que completaste todos los valores en `.env.local`
- Recarga el servidor (`npm run dev`)

❌ **"Firebase not initialized"**
- Asegúrate de llamar `initializeFirebase()` antes de usar otros módulos
- Puedes hacerlo en tu layout principal

❌ **Autenticación no funciona**
- Ve a Firebase Console > Authentication
- Habilita "Email/Password" como método de login
- Verifica que tienes usuarios creados

---

## 📖 Documentación oficial

- [Firebase JS SDK](https://firebase.google.com/docs/web/setup)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Authentication](https://firebase.google.com/docs/auth)
- [Storage](https://firebase.google.com/docs/storage)

¡Listo! 🚀 Tu conexión Firebase está completa y segura.
