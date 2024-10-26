import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import Carousel from '../components/Carousel';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { getRandomPuzzle, fetchCompletedPuzzles, fetchFavoritePuzzles } from '../../server';

const { width } = Dimensions.get('window');

const difficultyLevels = [
  {
    title: 'Easy',
    description: 'Perfect for beginners. Fewer pieces to solve, ideal to get started.',
  },
  {
    title: 'Medium',
    description: 'A bit of a challenge. More pieces for a balanced experience.',
  },
  {
    title: 'Hard',
    description: 'For puzzle masters. Lots of pieces to keep you engaged!',
  },
];

const fetchFonts = () => {
  return Font.loadAsync({
    'TimesNewRoman': require('../../assets/TimesNewRoman.ttf'), // Make sure you have this path correct
  });
};

const Home = ({ navigation }) => {
  const [userName, setUserName] = useState('');
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
            setUserName(userDoc.data().name);
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

  const renderCarouselItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleDifficultySelection(item.title)}>
      <View style={styles.carouselItem}>
        <Text style={styles.userTitle}>{item.title}</Text>
        <Text style={styles.userDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleDifficultySelection = (level) => {
    // Logic to handle what happens when a difficulty level is selected
    console.log(`Selected level: ${level}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>{userName ? `Welcome back, ${userName}` : "Guest"}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="account" size={30} color="#4A403A" />
        </TouchableOpacity>
      </View>
      <Carousel
        data={difficultyLevels}
        renderItem={renderCarouselItem}
        autoplay={false}
      />
      <Text style={styles.sectionTitle}>Completed Puzzles</Text>
      <FlatList
        data={completedPuzzles}
        renderItem={({ item }) => (
          <View style={styles.puzzleItem}>
            <Image source={{ uri: item.imageUri }} style={styles.puzzleImage} />
            <Text>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.sectionTitle}>Favorite Puzzles</Text>
      <FlatList
        data={favoritePuzzles}
        renderItem={({ item }) => (
          <View style={styles.puzzleItem}>
            <Image source={{ uri: item.imageUri }} style={styles.puzzleImage} />
            <Text>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F0EAD6',
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
    color: '#70543E',
    fontFamily: 'TimesNewRoman',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#4A403A',
  },
  carouselContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    width: width * 0.8,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 20,
  },
  userTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userDescription: {
    fontSize: 14,
    color: '#666',
  },
  puzzleImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  puzzleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default Home;
