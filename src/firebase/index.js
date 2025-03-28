import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqLJPu-wxLfcN1EgfhBWPuiTyLiAq853E",
  authDomain: "travel-buddy-match.firebaseapp.com",
  projectId: "travel-buddy-match",
  storageBucket: "travel-buddy-match.firebasestorage.app",
  messagingSenderId: "546610803604",
  appId: "1:546610803604:web:d57e26f73d0da584e09581",
  measurementId: "G-WH98HGSCGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize messaging conditionally (since it requires browser support)
let messaging = null;
isSupported().then(isSupported => {
  if (isSupported) messaging = getMessaging(app);
});

export { auth, db, storage, messaging };