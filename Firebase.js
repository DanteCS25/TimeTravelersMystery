// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCGMkGzrc5O8xjBp_Lk6yR3dwh8v4d9h18",
    authDomain: "timetravelersmystery.firebaseapp.com",
    projectId: "timetravelersmystery",
    storageBucket: "timetravelersmystery.appspot.com",
    messagingSenderId: "258904839126",
    appId: "1:258904839126:web:34029630c72548bddeca77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
