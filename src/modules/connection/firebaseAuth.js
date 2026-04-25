/**
 * Firebase Authentication Utilities
 * Centralized functions for auth operations
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { getAuthInstance } from './connectiodb.js';

const auth = getAuthInstance();

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object
 */
export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ User registered:', userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    throw error;
  }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ User logged in:', userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error('❌ Login error:', error.message);
    throw error;
  }
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log('✅ User logged out');
  } catch (error) {
    console.error('❌ Logout error:', error.message);
    throw error;
  }
}

/**
 * Get current user
 * @returns {Object|null} Current user or null
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('👤 User authenticated:', user.email);
      callback(user);
    } else {
      console.log('👤 No user authenticated');
      callback(null);
    }
  });
}

/**
 * Update user profile
 * @param {Object} profileData - Object with displayName and/or photoURL
 * @returns {Promise<void>}
 */
export async function updateUserProfile(profileData) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await updateProfile(user, profileData);
    console.log('✅ User profile updated');
  } catch (error) {
    console.error('❌ Update profile error:', error.message);
    throw error;
  }
}

/**
 * Update user email
 * @param {string} newEmail - New email address
 * @returns {Promise<void>}
 */
export async function updateUserEmail(newEmail) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await updateEmail(user, newEmail);
    console.log('✅ Email updated to:', newEmail);
  } catch (error) {
    console.error('❌ Update email error:', error.message);
    throw error;
  }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export async function updateUserPassword(newPassword) {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await updatePassword(user, newPassword);
    console.log('✅ Password updated');
  } catch (error) {
    console.error('❌ Update password error:', error.message);
    throw error;
  }
}

/**
 * Send password reset email
 * @param {string} email - User email
 * @returns {Promise<void>}
 */
export async function sendResetEmail(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Password reset email sent to:', email);
  } catch (error) {
    console.error('❌ Send reset email error:', error.message);
    throw error;
  }
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  subscribeToAuthState,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  sendResetEmail,
};
