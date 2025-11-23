import admin from 'firebase-admin';
import { config } from './env.config';

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      clientEmail: config.firebase.clientEmail,
      privateKey: config.firebase.privateKey,
    }),
    databaseURL: config.firebase.databaseURL,
    storageBucket: config.firebase.storageBucket,
  });

  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error);
  throw error;
}

// Export Firebase services
export const firestore = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
export const FieldValue = admin.firestore.FieldValue;

// Firestore settings for better performance
firestore.settings({
  ignoreUndefinedProperties: true,
});

export default admin;
