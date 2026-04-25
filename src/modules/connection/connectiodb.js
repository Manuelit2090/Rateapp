import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration from environment variables or window object
const getFirebaseConfig = () => {
  // Si viene de window (inyectado por Astro), usarlo
  if (typeof window !== 'undefined' && window.firebaseConfig) {
    return window.firebaseConfig;
  }
  
  // Si no, intentar leer de import.meta.env (solo server-side)
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  };
};

const firebaseConfig = getFirebaseConfig();

// Validate Firebase configuration
function validateFirebaseConfig(config) {
  const requiredKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingKeys = requiredKeys.filter((key) => {
    const value = config[key];
    return !value || (typeof value === 'string' && value.includes('your_'));
  });

  if (missingKeys.length > 0) {
    console.warn(
      `⚠️  Firebase Configuration Warning: Missing or incomplete values for: ${missingKeys.join(', ')}`
    );
    console.warn('Received config:', config);
    console.warn('Please update your .env.local file with correct Firebase credentials');
  }

  return true;
}

let app;
let auth;
let db;
let storage;
let isInitialized = false;

/**
 * Initialize Firebase services
 * @returns {Object} Firebase services object
 */
export function initializeFirebase() {
  try {
    if (isInitialized) {
      console.log('✅ Firebase already initialized');
      return { app, auth, db, storage };
    }

    // Validate configuration (warning only, don't throw)
    validateFirebaseConfig(firebaseConfig);

    // Initialize Firebase App
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase App initialized');

    // Initialize Auth
    auth = getAuth(app);
    console.log('✅ Firebase Auth initialized');

    // Initialize Firestore
    db = getFirestore(app);
    console.log('✅ Firestore initialized');

    // Initialize Storage
    storage = getStorage(app);
    console.log('✅ Storage initialized');

    // Enable emulators in development if needed
    if (import.meta.env.DEV) {
      // Uncomment below if using Firebase emulator suite locally
      // connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      // connectFirestoreEmulator(db, 'localhost', 8080);
      // connectStorageEmulator(storage, 'localhost', 9199);
    }

    isInitialized = true;
    console.log('🚀 Firebase fully initialized and ready to use');

    return { app, auth, db, storage };
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message);
    throw error;
  }
}

/**
 * Get Auth instance
 * @returns {Object} Firebase Auth instance
 */
export function getAuthInstance() {
  if (!isInitialized) {
    console.warn('⚠️  Firebase not initialized. Initializing now...');
    initializeFirebase();
  }
  return auth;
}

/**
 * Get Firestore instance
 * @returns {Object} Firestore instance
 */
export function getFirestoreInstance() {
  if (!isInitialized) {
    console.warn('⚠️  Firebase not initialized. Initializing now...');
    initializeFirebase();
  }
  return db;
}

/**
 * Get Storage instance
 * @returns {Object} Storage instance
 */
export function getStorageInstance() {
  if (!isInitialized) {
    console.warn('⚠️  Firebase not initialized. Initializing now...');
    initializeFirebase();
  }
  return storage;
}

/**
 * Get all Firebase services
 * @returns {Object} All Firebase services
 */
export function getFirebaseServices() {
  if (!isInitialized) {
    initializeFirebase();
  }
  return { auth, db, storage };
}

export default {
  initializeFirebase,
  getAuthInstance,
  getFirestoreInstance,
  getStorageInstance,
  getFirebaseServices,
};
