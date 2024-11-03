import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import * as Font from 'expo-font';

const Profile = ({ navigation }) => {
  const user = auth.currentUser;
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
      navigation.navigate('LoginSignup');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const handleAdminLogin = () => {
    navigation.navigate('Admin');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <Text style={styles.userName}>Name: {userData.name || "Anonymous"}</Text>
          <Text style={styles.userEmail}>Email: {user.email}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#FFF" style={styles.iconStyle} />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
          {user.email === 'admin@gmail.com' && (
            <TouchableOpacity style={styles.adminButton} onPress={handleAdminLogin}>
              <Text style={styles.adminButtonText}>Go to Admin Page</Text>
            </TouchableOpacity>
          )}
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F0EAD6',
    padding: 30,
    paddingTop: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3e2723',
    marginBottom: 10,
    fontFamily: 'Times New Roman',
  },
  userName: {
    fontSize: 18,
    color: '#3e2723',
    fontFamily: 'Times New Roman',
  },
  userEmail: {
    fontSize: 16,
    color: '#3e2723',
    fontFamily: 'Times New Roman',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#AC9F93',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
  },
  iconStyle: {
    color: '#D8C8B8',
  },
  adminButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#AC9F93',
    borderRadius: 5,
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Times New Roman',
  },
  text: {
    fontSize: 16,
    color: '#3e2723',
    fontFamily: 'Times New Roman',
  }
});

export default Profile;
