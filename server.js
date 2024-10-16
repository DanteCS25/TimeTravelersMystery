import cors from 'cors';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth, storage } from "./Firebase";
import { doc, setDoc, collection, addDoc, getDocs } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

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

export const handleSignup = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user.email);

    // Save user to Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: user.email,
      createdAt: new Date(),
    });
    console.log('User data saved to Firestore');
  } catch (error) {
    console.log('Error signing up or saving user:', error.message);
  }
};

export const uploadImage = async (imageUri, customName) => {
  try {
    const storage = getStorage();
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Create a reference to the storage location
    const storageRef = ref(storage, `images/${customName}`);

    // Upload the file to Firebase Storage
    await uploadBytes(storageRef, blob);
    console.log("Image uploaded to Firebase Storage");

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log("File available at", downloadURL);

    // Save the image URL to Firestore
    const docRef = await addDoc(collection(db, "images"), {
      name: customName,
      uri: downloadURL,
      createdAt: new Date(),
    });
    console.log("Image metadata saved with ID: ", docRef.id);
  } catch (error) {
    console.error("Error uploading image: ", error.message);
  }
};

export const fetchImages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "images"));
    const fetchedImages = [];
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const imageRef = ref(storage, `images/${data.name}`); // Adjust the path if necessary
      const downloadURL = await getDownloadURL(imageRef); // Get the download URL
      fetchedImages.push({ id: doc.id, uri: downloadURL, name: data.name });
    }
    return fetchedImages;
  } catch (error) {
    console.error("Error fetching images: ", error);
    throw error; // Rethrow the error for handling in the component
  }
};
