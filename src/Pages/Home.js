import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ImageBackground, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import Carousel from 'react-native-snap-carousel';
import * as Font from 'expo-font';
import { fetchCompletedPuzzles, fetchFavoritePuzzles } from '../../server';

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
  const [currentIndex, setCurrentIndex] = useState(0); // State for tracking current index

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

  const onCarouselChange = (index) => {
    setCurrentIndex(index); // Update the current index when carousel changes
  };

  return (
    <ImageBackground
      source={require('../../assets/Paper2.jpg')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            sliderWidth={width}
            itemWidth={width * 0.8}
            onSnapToItem={onCarouselChange}
          />
          <View style={styles.indicatorContainer}>
            {difficultyLevels.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentIndex === index ? styles.activeIndicator : null,
                ]}
              />
            ))}
          </View>
          <Text style={styles.sectionTitle}>Completed Puzzles</Text>
          <Carousel
            data={completedPuzzles}
            renderItem={({ item }) => (
              <View style={styles.puzzleItem}>
                <Image source={{ uri: item.imageUri }} style={styles.puzzleImage} />
                <Text style={styles.puzzleName}>{item.name}</Text>
              </View>
            )}
            sliderWidth={width}
            itemWidth={width * 0.8}
            onSnapToItem={(index) => setCurrentIndex(index)}
          />
          <Text style={styles.sectionTitle}>Favorite Puzzles</Text>
          <Carousel
            data={favoritePuzzles}
            renderItem={({ item }) => (
              <View style={styles.puzzleItem}>
                <Image source={{ uri: item.imageUri }} style={styles.puzzleImage} />
                <Text style={styles.puzzleName}>{item.name}</Text>
              </View>
            )}
            sliderWidth={width}
            itemWidth={width * 0.8}
            onSnapToItem={(index) => setCurrentIndex(index)}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: 'transparent', // Ensure transparency to see background image
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#8B4513', // Dark brown for a vintage look
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    color: '#4B3A2A', // Rich brown color
    fontFamily: 'TimesNewRoman',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#4B3A2A',
    fontFamily: 'TimesNewRoman',
    borderBottomWidth: 1,
    borderBottomColor: '#8B4513',
    paddingBottom: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: 20,
  },
  carouselItem: {
    width: width * 0.8,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
    marginVertical: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B3A2A',
    fontFamily: 'TimesNewRoman',
    marginBottom: 5,
  },
  userDescription: {
    fontSize: 16,
    color: '#4B3A2A',
    fontFamily: 'TimesNewRoman',
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF8E1',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#8B4513',
  },
  puzzleImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  puzzleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 5,
    backgroundColor: '#FFF8E1',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  puzzleName: {
    fontSize: 20,
    fontFamily: 'TimesNewRoman',
    color: '#4B3A2A',
    flex: 1,
    textAlign: 'left',
  },
});

export default Home;
