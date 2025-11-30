import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBjcQdRgd3MI4w2fwkUJrOrEvYmeaXSDI8",
  authDomain: "derma-9f37d.firebaseapp.com",
  projectId: "derma-9f37d",
  storageBucket: "derma-9f37d.firebasestorage.app",
  messagingSenderId: "66227919278",
  appId: "1:66227919278:web:c4cb521f8abab9e071d03f",
  measurementId: "G-CCVK01FTPW",
};

// Initialize Firebase only once
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth (persistence handled automatically by Firebase)
const auth: Auth = getAuth(app);

// Initialize Firestore
const db: Firestore = getFirestore(app);

// Initialize Storage
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };


