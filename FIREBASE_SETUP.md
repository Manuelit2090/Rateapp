# 🔥 Firebase Setup Guide - RateApp

## ✅ Configuración Completada

Tu proyecto Rateapp está totalmente configurado con Firebase. Aquí está el resumen:

### 📁 Archivos Creados

```
src/
├── modules/
│   └── connection/
│       ├── connectiodb.js          # Inicialización de Firebase
│       ├── firebaseAuth.js         # Funciones de autenticación
│       ├── firebaseQueries.js      # Funciones de Firestore CRUD
│       └── README.md               # Documentación detallada
├── components/
│   └── FirebaseTest.vue            # Componente test (Vue 3)
├── pages/
│   └── firebase-test.astro         # Página de prueba
└── styles/
    └── global.css                  # Estilos globales

.env.local                           # Variables de entorno (NO SUBIR A GIT)
```

## 🚀 Próximos Pasos

### 1️⃣ Completar las Credenciales de Firebase

Abre [.env.local](.env.local) y reemplaza los valores:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_DATABASE_URL=https://tu_proyecto.firebaseio.com
```

**Dónde obtenerlas:**
1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto
3. ⚙️ Configuración > Configuración del proyecto > Apps > Web
4. Copia toda la configuración

### 2️⃣ Reinicia el Servidor

```bash
# Detén el servidor actual (Ctrl+C)
npm run dev
```

### 3️⃣ Prueba la Conexión

1. Abre: `http://localhost:3000/firebase-test`
2. Deberías ver ✅ en verde indicando que todo funciona

## 📚 Cómo Usar en Tus Componentes

### Inicializar Firebase (Una sola vez)

En el frontmatter de Astro o al cargar tu app:

```astro
---
import { initializeFirebase } from '@/modules/connection/connectiodb';

// Inicializa una sola vez
initializeFirebase();
---
```

### Usar Autenticación

```astro
---
import { loginUser, registerUser, logoutUser, getCurrentUser } from '@/modules/connection/firebaseAuth';

// Registrar usuario
const user = await registerUser('email@example.com', 'password123');

// Login
const user = await loginUser('email@example.com', 'password123');

// Logout
await logoutUser();

// Obtener usuario actual
const currentUser = getCurrentUser();
---
```

### Usar Firestore (Base de Datos)

```astro
---
import { 
  createDocument, 
  getDocumentById,
  getAllDocuments,
  queryDocuments,
  updateDocument,
  deleteDocument
} from '@/modules/connection/firebaseQueries';

// Crear documento
const id = await createDocument('restaurantes', {
  nombre: 'Mi Restaurante',
  ciudad: 'Madrid',
  rating: 4.5
});

// Obtener documento por ID
const restaurante = await getDocumentById('restaurantes', id);

// Obtener todos
const todos = await getAllDocuments('restaurantes');

// Obtener con límite
const primeros10 = await getAllDocuments('restaurantes', 10);

// Consultar con condiciones
const buenos = await queryDocuments('restaurantes', [
  ['rating', '>=', 4]
]);

// Actualizar
await updateDocument('restaurantes', id, { rating: 4.8 });

// Eliminar
await deleteDocument('restaurantes', id);
---
```

### En Componentes Vue

```vue
<template>
  <div>
    <h1>{{ restaurante?.nombre }}</h1>
    <button @click="cargarDatos">Cargar</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAllDocuments } from '@/modules/connection/firebaseQueries.js';

const restaurante = ref(null);

async function cargarDatos() {
  const docs = await getAllDocuments('restaurantes', 1);
  restaurante.value = docs[0];
}
</script>
```

## 🔒 Seguridad

### ✅ Hecho
- Variables de entorno en `.env.local` (no se suben a git)
- Validación de configuración automática
- Manejo de errores completo

### 📋 Checklist de Seguridad en Firebase Console

1. **Authentication** → Habilita "Email/Password"
2. **Firestore** → Establece reglas de seguridad (no dejar públicas en producción)
3. **Storage** → Configura reglas de permisos
4. **IAM** → Solo dale acceso al equipo necesario

## 🆘 Solución de Problemas

| Problema | Solución |
|----------|----------|
| "Credenciales inválidas" | Verifica `.env.local` con valores reales y reinicia servidor |
| Error 404 en firebase-test | Limpia caché del navegador (Ctrl+Shift+Del) |
| "Firebase not initialized" | Llama a `initializeFirebase()` antes de usar servicios |
| Autenticación no funciona | Habilita "Email/Password" en Firebase Console |
| Firestore no guarda datos | Verifica reglas de seguridad en Firebase Console |

## 📖 Documentación

- [Firebase JS SDK](https://firebase.google.com/docs/web/setup)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Authentication](https://firebase.google.com/docs/auth)
- [Storage](https://firebase.google.com/docs/storage)
- [Astro Docs](https://docs.astro.build)
- [Vue 3 Docs](https://vuejs.org)

## 🎯 Próximas Acciones

1. ✅ Completa las credenciales en `.env.local`
2. ✅ Reinicia el servidor
3. ✅ Prueba en `http://localhost:3000/firebase-test`
4. ✅ Empieza a usar en tus componentes

---

**¡Tu conexión Firebase está lista y lista para usar! 🚀**

Si necesitas ayuda con componentes específicos, consulta las funciones en `src/modules/connection/`
