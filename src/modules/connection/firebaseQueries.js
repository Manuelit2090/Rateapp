/**
 * Firebase Query Utilities
 * Centralized functions for common Firestore operations
 */

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { getFirestoreInstance } from './connectiodb.js';

const db = getFirestoreInstance();

/**
 * Get a single document by ID
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<Object>} Document data with ID
 */
export async function getDocumentById(collectionName, docId) {
  try {
    const docRef = doc(getFirestoreInstance(), collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    console.warn(`Document not found: ${collectionName}/${docId}`);
    return null;
  } catch (error) {
    console.error(`Error fetching document ${docId}:`, error);
    throw error;
  }
}

/**
 * Get all documents from a collection
 * @param {string} collectionName - Collection name
 * @param {number} limitCount - Optional limit (default: no limit)
 * @returns {Promise<Array>} Array of documents
 */
export async function getAllDocuments(collectionName, limitCount = null) {
  try {
    let q = collection(getFirestoreInstance(), collectionName);
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching documents from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Query documents with conditions
 * @param {string} collectionName - Collection name
 * @param {Array} conditions - Array of [field, operator, value] arrays
 * @param {number} limitCount - Optional limit
 * @returns {Promise<Array>} Filtered documents
 */
export async function queryDocuments(collectionName, conditions = [], limitCount = null) {
  try {
    let constraints = conditions.map(([field, op, value]) => where(field, op, value));
    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    const q = query(collection(getFirestoreInstance(), collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error querying ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Create a new document
 * @param {string} collectionName - Collection name
 * @param {Object} data - Document data
 * @returns {Promise<string>} New document ID
 */
export async function createDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(getFirestoreInstance(), collectionName), {
      ...data,
      createdAt: new Date(),
    });
    console.log(`✅ Document created: ${collectionName}/${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Set a document with specific ID (overwrites if exists)
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Object} data - Document data
 * @returns {Promise<void>}
 */
export async function setDocument(collectionName, docId, data) {
  try {
    const docRef = doc(getFirestoreInstance(), collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
    console.log(`✅ Document set: ${collectionName}/${docId}`);
  } catch (error) {
    console.error(`Error setting document ${docId}:`, error);
    throw error;
  }
}

/**
 * Update a document
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Object} data - Fields to update
 * @returns {Promise<void>}
 */
export async function updateDocument(collectionName, docId, data) {
  try {
    const docRef = doc(getFirestoreInstance(), collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
    console.log(`✅ Document updated: ${collectionName}/${docId}`);
  } catch (error) {
    console.error(`Error updating document ${docId}:`, error);
    throw error;
  }
}

/**
 * Delete a document
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<void>}
 */
export async function deleteDocument(collectionName, docId) {
  try {
    const docRef = doc(getFirestoreInstance(), collectionName, docId);
    await deleteDoc(docRef);
    console.log(`✅ Document deleted: ${collectionName}/${docId}`);
  } catch (error) {
    console.error(`Error deleting document ${docId}:`, error);
    throw error;
  }
}

/**
 * Real-time listener on a document
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export function subscribeToDocument(collectionName, docId, callback) {
  try {
    const docRef = doc(getFirestoreInstance(), collectionName, docId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  } catch (error) {
    console.error(`Error subscribing to document:`, error);
    throw error;
  }
}

export default {
  getDocumentById,
  getAllDocuments,
  queryDocuments,
  createDocument,
  setDocument,
  updateDocument,
  deleteDocument,
  subscribeToDocument,
};
