import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCGMkGzrc5O8xjBp_Lk6yR3dwh8v4d9h18",
    authDomain: "timetravelersmystery.firebaseapp.com",
    projectId: "timetravelersmystery",
    storageBucket: "timetravelersmystery.appspot.com",
    messagingSenderId: "258904839126",
    appId: "1:258904839126:web:34029630c72548bddeca77",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const storage = getStorage(app);
