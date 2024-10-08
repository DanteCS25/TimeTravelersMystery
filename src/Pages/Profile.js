import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth, db } from '../../Firebase';
import { doc, getDoc } from 'firebase/firestore';

const Profile = ({ navigation }) => {
  const user = auth.currentUser;
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user) {
      // Fetch user data from the database
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid)); 
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <Text style={styles.text}>Name: {userName || "Anonymous"}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
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
});

export default Profile;
