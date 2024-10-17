import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { auth, db } from '../../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const Profile = ({ navigation }) => {
  const user = auth.currentUser;
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          console.log("Fetching data for user:", user);
          const userDoc = await getDoc(doc(db, 'users', user.uid)); 
          console.log("User document:", userDoc);
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };

      fetchUserData();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
      navigation.navigate('LoginSignup'); // Redirect to Login page after logout
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <Text style={styles.text}>Name: {userName || "Anonymous"}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>No user data available. Please log in.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A403A',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  text: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;
