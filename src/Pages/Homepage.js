import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../Firebase';
import { doc, getDoc } from 'firebase/firestore';

const Homepage = ({ navigation }) => {
  const user = auth.currentUser;
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
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
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.userName}>{userName ? `Welcome Piece, ${userName}` : "Guest"}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="account" size={30} color="#4A403A" />
        </TouchableOpacity>
      </View>
      {/* Other homepage content goes here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
    padding: 30,
    paddingTop: 50,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  userName: {
    fontSize: 18,
    color: '#4A403A',
    fontFamily: 'serif',
  },
});

export default Homepage;
