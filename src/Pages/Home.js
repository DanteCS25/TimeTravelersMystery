import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import Carousel from '../components/Carousel';
import PuzzleNr1 from '../../assets/PuzzleNr1.png';
import PuzzleNr2 from '../../assets/PuzzleNr2.png';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const { width } = Dimensions.get('window');

const users = [
  {
    title: 'Puzzle',
    image: PuzzleNr1,
    description: 'A psychological thriller directed by Todd Phillips.',
  },
  {
    title: 'Puzzle',
    image: PuzzleNr2,
    description: 'The ultimate superhero movie experience.',
  },
  {
    title: 'Puzzle',
    image: PuzzleNr1,
    description: 'A psychological thriller directed by Todd Phillips.',
  },
  {
    title: 'Puzzle',
    image: PuzzleNr2,
    description: 'The ultimate superhero movie experience.',
  },
];

const fetchFonts = () => {
  return Font.loadAsync({
    'TimesNewRoman': require('../../assets/TimesNewRoman.ttf'), // Make sure you have this path correct
  });
};

const Homepage = ({ navigation }) => {
  const user = auth.currentUser;
  const [userName, setUserName] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);

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

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) {
    return <AppLoading />;
  }

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.userImage} />
      <Text style={styles.userTitle}>{item.title}</Text>
      <Text style={styles.userDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>{userName ? `Welcome back, ${userName}` : "Guest"}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="account" size={30} color="#4A403A" />
        </TouchableOpacity>
      </View>
      <Carousel
        data={users}
        renderItem={renderCarouselItem}
        autoplay={true}
        autoplayInterval={3000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F0EAD6', // Changed to a more antique shade of off-white
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
    color: '#70543E', // Changed to a warm, deep brown
    fontFamily: 'TimesNewRoman', // Apply Times New Roman here
  },
  carouselItem: {
    width: width * 0.50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF8E1', // Creamy white background to soften the visual
    borderRadius: 8,
    marginHorizontal: 10,
    borderWidth: 2, // Adding a border
    borderColor: '#CABBA2', // A soft, vintage gold tone for the border
  },
  userImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  userTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A403A',
    marginTop: 10,
    fontFamily: 'TimesNewRoman', // Apply Times New Roman here
  },
  userDescription: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 5,
    fontFamily: 'TimesNewRoman', // Apply Times New Roman here
  },
});

export default Homepage;
