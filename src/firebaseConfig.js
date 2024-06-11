// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyDpRey4Zsi5zA-2izTX4aZUTL0KgKJ4nXM",
  authDomain: "fonkagram.firebaseapp.com",
  projectId: "fonkagram",
  storageBucket: "fonkagram.appspot.com",
  messagingSenderId: "190769303041",
  appId: "1:190769303041:web:a4c1c145cd69d13c04fa00",
  measurementId: "G-TQ46VQVP6F"
};

/// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
