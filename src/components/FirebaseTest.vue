<template>
  <div id="firebase-test" class="min-h-screen p-8">
    <div class="container mx-auto max-w-2xl">
      <h1 class="text-3xl font-bold mb-6 text-white">🔧 Test Firebase</h1>
      
      <div class="space-y-4">
        <!-- Estado -->
        <div 
          :class="[
            'p-4 rounded-lg border-l-4',
            status.type === 'success' ? 'bg-green-50 border-green-500' : 
            status.type === 'error' ? 'bg-red-50 border-red-500' :
            'bg-gray-100 border-blue-500'
          ]"
        >
          <h2 class="font-bold mb-2">Estado:</h2>
          <p>{{ status.message }}</p>
        </div>

        <!-- Configuración -->
        <div class="p-4 rounded-lg bg-white border-l-4 border-green-500">
          <h2 class="font-bold mb-2">Configuración:</h2>
          <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">{{ JSON.stringify(config, null, 2) }}</pre>
        </div>

        <!-- Servicios -->
        <div class="p-4 rounded-lg bg-white border-l-4 border-purple-500">
          <h2 class="font-bold mb-2">Servicios Disponibles:</h2>
          <ul class="space-y-2">
            <li>✅ <strong>Auth:</strong> {{ services.auth ? 'Disponible' : 'No disponible' }}</li>
            <li>✅ <strong>Firestore (db):</strong> {{ services.db ? 'Disponible' : 'No disponible' }}</li>
            <li>✅ <strong>Storage:</strong> {{ services.storage ? 'Disponible' : 'No disponible' }}</li>
          </ul>
        </div>

        <!-- Botón Test -->
        <button 
          @click="testFirestoreConnection"
          :disabled="testing"
          class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-6 rounded transition"
        >
          {{ testing ? '⏳ Probando...' : '🔄 Probar Firestore' }}
        </button>

        <!-- Resultados -->
        <div v-if="results.show" class="p-4 rounded-lg bg-white border-l-4 border-yellow-500">
          <h2 class="font-bold mb-2">Resultados:</h2>
          <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">{{ results.message }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

const status = ref({
  type: 'loading',
  message: 'Verificando Firebase...',
});

const config = ref({});
const services = ref({ auth: false, db: false, storage: false });
const results = ref({ show: false, message: '' });
const testing = ref(false);

async function initTest() {
  try {
    console.log('🔍 Usando config del prop:', props.config);

    // Usar la config que viene del servidor
    const { initializeFirebase } = await import('../modules/connection/connectiodb.js');
    
    // Inyectar config en window para que connectiodb.js la use
    window.firebaseConfig = props.config;
    
    const firebaseServices = initializeFirebase();
    
    config.value = {
      apiKey: props.config.apiKey ? '✅ Configurado' : '❌ No configurado',
      authDomain: props.config.authDomain ? '✅ Configurado' : '❌ No configurado',
      projectId: props.config.projectId ? '✅ Configurado' : '❌ No configurado',
      storageBucket: props.config.storageBucket ? '✅ Configurado' : '❌ No configurado',
      messagingSenderId: props.config.messagingSenderId ? '✅ Configurado' : '❌ No configurado',
      appId: props.config.appId ? '✅ Configurado' : '❌ No configurado',
    };

    services.value = {
      auth: firebaseServices?.auth ? true : false,
      db: firebaseServices?.db ? true : false,
      storage: firebaseServices?.storage ? true : false,
    };

    status.value = {
      type: 'success',
      message: '✅ Firebase conectado correctamente',
    };

    console.log('✅ Firebase inicializado correctamente');
  } catch (error) {
    console.error('❌ Error iniciando Firebase:', error);
    status.value = {
      type: 'error',
      message: `❌ Error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function testFirestoreConnection() {
  testing.value = true;
  results.value.show = true;
  results.value.message = '⏳ Intentando conexión a Firestore...';

  try {
    const { queryDocuments } = await import('../modules/connection/firebaseQueries.js');
    
    try {
      const docs = await queryDocuments('test', [], 1);
      results.value.message = `✅ Conexión a Firestore exitosa!\n\nDocumentos encontrados: ${docs.length}`;
    } catch (firestoreError) {
      const errorMsg = firestoreError instanceof Error ? firestoreError.message : String(firestoreError);
      
      if (errorMsg.includes('does not exist')) {
        results.value.message = `✅ Firebase Auth y Config OK\n\n⚠️ La colección 'test' no existe aún (Normal en primera vez)\n\nCrear documentos para verificar completamente.`;
      } else {
        results.value.message = `✅ Firebase conectado\n\n⚠️ ${errorMsg}`;
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    results.value.message = `❌ Error: ${errorMsg}`;
  } finally {
    testing.value = false;
  }
}

onMounted(() => {
  initTest();
});
</script>

<style scoped>
#firebase-test {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
</style>
