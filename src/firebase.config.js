import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBF0nw8AIpBQn2eNoyeH2kZrPHgkOrLVtg',
  authDomain: 'home-marketplace-app-13dca.firebaseapp.com',
  projectId: 'home-marketplace-app-13dca',
  storageBucket: 'home-marketplace-app-13dca.appspot.com',
  messagingSenderId: '396296322445',
  appId: '1:396296322445:web:b45a8232fee7aceb7411c4',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
