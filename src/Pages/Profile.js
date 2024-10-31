import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Carousel from 'react-native-snap-carousel';
import * as Font from 'expo-font';
import { fetchCompletedPuzzles, fetchFavoritePuzzles } from '../../server';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const fetchFonts = () => {
  return Font.loadAsync({
    'TimesNewRoman': require('../../assets/TimesNewRoman.ttf'), // Make sure you have this path correct
  });
};

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [fontLoaded, setFontLoaded] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState([]);
  const [favoritePuzzles, setFavoritePuzzles] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
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

    const fetchPuzzles = async () => {
      try {
        const completed = await fetchCompletedPuzzles();
        const favorites = await fetchFavoritePuzzles();
        setCompletedPuzzles(completed);
        setFavoritePuzzles(favorites);
      } catch (error) {
        console.error("Error fetching puzzles: ", error);
      }
    };

    fetchUserData();
    fetchPuzzles();
  }, []);

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) {
    return <AppLoading />;
  }

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

  const renderCarouselItem = ({ item }) => (
    <View style={styles.puzzleItemSmaller}>
      <Image source={{ uri: item.imageUri }} style={styles.puzzleImageSmaller} />
      <Text style={styles.puzzleNameSmaller}>{item.name}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/Paper2.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.profileContainerLeftAligned}>
        <Text style={styles.profileTitle}>Profile</Text>
        {auth.currentUser ? (
          <>
            <Text style={styles.profileUserName}>Name: {userData.name || "Anonymous"}</Text>
            <Text style={styles.profileUserEmail}>Email: {auth.currentUser.email}</Text>
            <TouchableOpacity style={styles.logoutButtonLeftAligned} onPress={handleLogout}>
              <Icon name="logout" size={24} color="#FFF" style={styles.iconStyle} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            {auth.currentUser.email === 'admin@gmail.com' && (
              <TouchableOpacity style={styles.adminButtonLeftAligned} onPress={handleAdminLogin}>
                <Text style={styles.adminButtonText}>Go to Admin Page</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.sectionTitle}>Completed Puzzles</Text>
            <Carousel
              data={completedPuzzles}
              renderItem={renderCarouselItem}
              sliderWidth={width}
              itemWidth={width * 0.6}
              containerCustomStyle={{ alignSelf: 'flex-start' }}
            />
            <Text style={styles.sectionTitle}>Favorite Puzzles</Text>
            <Carousel
              data={favoritePuzzles}
              renderItem={renderCarouselItem}
              sliderWidth={width}
              itemWidth={width * 0.6}
              containerCustomStyle={{ alignSelf: 'flex-start' }}
            />
          </>
        ) : (
          <Text style={styles.text}>No user data available. Please log in.</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  profileContainerLeftAligned: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    padding: 30,
    paddingTop: 70,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  profileTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4B3A2A',
    marginBottom: 10,
    fontFamily: 'TimesNewRoman',
    textAlign: 'left',
  },
  profileUserName: {
    fontSize: 22,
    color: '#4B3A2A',
    fontFamily: 'TimesNewRoman',
    textAlign: 'left',
  },
  profileUserEmail: {
    fontSize: 22,
    color: '#4B3A2A',
    fontFamily: 'TimesNewRoman',
    marginBottom: 20,
    textAlign: 'left',
  },
  logoutButtonLeftAligned: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#4A403A',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'TimesNewRoman',
  },
  adminButtonLeftAligned: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#4A403A',
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  adminButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'TimesNewRoman',
  },
  text: {
    fontSize: 16,
    color: '#4B3A2A',
    fontFamily: 'TimesNewRoman',
    textAlign: 'left',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    color: '#4B3A2A',
    fontFamily: 'TimesNewRoman',
    borderBottomWidth: 1,
    borderBottomColor: '#8B4513',
    paddingBottom: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
    textAlign: 'left',
  },
  puzzleItemSmaller: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.6,
    height: 100,
    backgroundColor: '#FFF8E1',
    borderRadius: 15,
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'flex-start',
  },
  puzzleImageSmaller: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  puzzleNameSmaller: {
    fontSize: 18,
    fontFamily: 'TimesNewRoman',
    color: '#4B3A2A',
    flex: 1,
    textAlign: 'left',
  },
});

export default Profile;
