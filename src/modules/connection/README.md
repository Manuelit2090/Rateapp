# 🔐 Firebase Connection Guide

## 📋 Archivos creados

1. **`.env.local`** - Variables de entorno (privadas)
2. **`connectiodb.js`** - Inicialización principal de Firebase
3. **`firebaseQueries.js`** - Funciones para Firestore (CRUD)
4. **`firebaseAuth.js`** - Funciones de autenticación

---

## 🚀 Pasos para configurar

### 1. Obtén tus credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a ⚙️ **Configuración del proyecto**
4. Haz clic en la aplicación web
5. Copia los datos de configuración

### 2. Actualiza `.env.local`

Reemplaza los valores en `c:\Users\Estudiante\Documents\project-media\Rateapp\.env.local`:

```env
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_DATABASE_URL=https://tu_proyecto.firebaseio.com
```

---

## 📚 Cómo usar en tus componentes

### Inicializar Firebase (en tu layout o página principal)

```javascript
import { initializeFirebase } from '@/modules/connection/connectiodb';

// Solo una vez en tu app
initializeFirebase();
```

### Usar autenticación

```javascript
import { 
  registerUser, 
  loginUser, 
  logoutUser,
  subscribeToAuthState,
  getCurrentUser 
} from '@/modules/connection/firebaseAuth';

// Registrar usuario
const user = await registerUser('email@example.com', 'password123');

// Login
const user = await loginUser('email@example.com', 'password123');

// Logout
await logoutUser();

// Escuchar cambios de auth (en tiempo real)
subscribeToAuthState((user) => {
  if (user) {
    console.log('Usuario logueado:', user.email);
  } else {
    console.log('Usuario NO logueado');
  }
});

// Obtener usuario actual
const user = getCurrentUser();
```

### Usar Firestore

```javascript
import { 
  createDocument, 
  getDocumentById, 
  getAllDocuments, 
  queryDocuments, 
  updateDocument, 
  deleteDocument,
  subscribeToDocument
} from '@/modules/connection/firebaseQueries';

// Crear documento
const id = await createDocument('usuarios', {
  nombre: 'Juan',
  email: 'juan@example.com',
  rol: 'cliente'
});

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
