import cors from 'cors';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from "./Firebase";
import { doc, setDoc } from "firebase/firestore"; 

export const handleLogin = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User logged in:', user.email);
    })
    .catch((error) => {
      console.log('Login error:', error.message);
    });
};

export const handleSignup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user.email);

    // Save user to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
    });
    console.log('User data saved to Firestore');
  } catch (error) {
    console.log('Error signing up or saving user:', error.message);
  }
};
