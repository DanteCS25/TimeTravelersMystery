import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from "./Firebase";
import { doc, setDoc, collection, addDoc, getDocs } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

const ADMIN_EMAIL = "admin@gmail.com"; // Replace with your admin email
const ADMIN_PASSWORD = "adminPassword"; // Replace with your admin password

export const handleLogin = (email, password) => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    console.log('Admin logged in:', email);
    return Promise.resolve({ user: { email } }); // Simulate successful login for admin
  }

  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log('User logged in:', user.email);
      return userCredential; // Return user credential for non-admin users
    })
    .catch((error) => {
      console.log('Login error:', error.message);
      throw error; // Rethrow error for handling in the component
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
    // Fetch from the correct collection name "newImages"
    const querySnapshot = await getDocs(collection(db, "newImages"));
    const fetchedImages = [];
    querySnapshot.forEach((doc) => {
      console.log("Fetched document:", doc.data()); // Log each document's data
      fetchedImages.push({ id: doc.id, ...doc.data() });
    });
    console.log("All fetched images:", fetchedImages); // Log all fetched images
    return fetchedImages;
  } catch (error) {
    console.error("Error fetching images: ", error);
    throw error; // Rethrow the error for handling in the component
  }
};

