import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAxgyaaAMItQoaduphVvbgx5bTZtdxeqiw",
    authDomain: "fir-retro-f6ff4.firebaseapp.com",
    projectId: "fir-retro-f6ff4",
    storageBucket: "fir-retro-f6ff4.appspot.com",
    messagingSenderId: "952895017980",
    appId: "1:952895017980:web:7e5c759401713790e6d879"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
